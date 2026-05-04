from flask import Flask, request, jsonify, send_from_directory
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from flask_cors import CORS
from config import Config
from models import get_user_by_phone, get_user_by_id, create_user, update_user_pin
import re

app = Flask(__name__)
app.config.from_object(Config)

# ── Extensions ──────────────────────────────────────
db     = MySQL(app)
bcrypt = Bcrypt(app)
jwt    = JWTManager(app)
CORS(app, origins="*")

# ── Serve your HTML file directly ───────────────────
@app.route("/")
def index():
    return send_from_directory(".", "prahari-v3 (1).html")

# ── Helpers ─────────────────────────────────────────
def valid_phone(p): return bool(re.match(r"^\d{10}$", p))
def valid_pin(p):   return bool(re.match(r"^\d{4}$",  p))

# ════════════════════════════════════════════════════
# SIGN UP
# ════════════════════════════════════════════════════
@app.route("/api/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()

    # Validate required fields
    for field in ["full_name", "phone_number", "gender",
                  "date_of_birth", "area_pin_code", "login_pin"]:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    if not valid_phone(data["phone_number"]):
        return jsonify({"error": "Phone must be exactly 10 digits"}), 400

    if not valid_pin(data["login_pin"]):
        return jsonify({"error": "PIN must be exactly 4 digits"}), 400

    cur = db.connection.cursor()

    # Check duplicate phone
    if get_user_by_phone(cur, data["phone_number"]):
        cur.close()
        return jsonify({"error": "Phone number already registered"}), 409

    # Hash PIN & save
    hashed_pin = bcrypt.generate_password_hash(data["login_pin"]).decode("utf-8")
    user_id = create_user(cur, data, hashed_pin)
    db.connection.commit()
    cur.close()

    token = create_access_token(identity=str(user_id))
    return jsonify({
        "message": "Account created successfully! 🎉",
        "token": token,
        "user": {
            "id": user_id,
            "full_name": data["full_name"],
            "phone_number": data["phone_number"]
        }
    }), 201


# ════════════════════════════════════════════════════
# SIGN IN
# ════════════════════════════════════════════════════
@app.route("/api/auth/signin", methods=["POST"])
def signin():
    data = request.get_json()
    phone = data.get("phone_number")
    pin   = data.get("login_pin")

    if not phone or not pin:
        return jsonify({"error": "Phone number and PIN are required"}), 400

    cur  = db.connection.cursor()
    user = get_user_by_phone(cur, phone)
    cur.close()

    if not user:
        return jsonify({"error": "No account found with this phone number"}), 404

    if not bcrypt.check_password_hash(user["login_pin"], pin):
        return jsonify({"error": "Incorrect PIN. Try again."}), 401

    token = create_access_token(identity=str(user["id"]))
    return jsonify({
        "message": "Login successful! 👋",
        "token": token,
        "user": {
            "id":                user["id"],
            "full_name":         user["full_name"],
            "phone_number":      user["phone_number"],
            "gender":            user["gender"],
            "is_specially_abled":user["is_specially_abled"]
        }
    }), 200


# ════════════════════════════════════════════════════
# GET CURRENT USER  (protected)
# ════════════════════════════════════════════════════
@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    cur  = db.connection.cursor()
    user = get_user_by_id(cur, user_id)
    cur.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200


# ════════════════════════════════════════════════════
# CHANGE PIN  (protected)
# ════════════════════════════════════════════════════
@app.route("/api/auth/change-pin", methods=["PUT"])
@jwt_required()
def change_pin():
    user_id = get_jwt_identity()
    data    = request.get_json()
    old_pin = data.get("old_pin")
    new_pin = data.get("new_pin")

    if not old_pin or not new_pin:
        return jsonify({"error": "Both old and new PIN are required"}), 400

    if not valid_pin(new_pin):
        return jsonify({"error": "New PIN must be exactly 4 digits"}), 400

    cur  = db.connection.cursor()
    user = get_user_by_id(cur, user_id)

    # Re-fetch with pin for verification
    cur.execute("SELECT login_pin FROM users WHERE id = %s", (user_id,))
    row = cur.fetchone()

    if not bcrypt.check_password_hash(row["login_pin"], old_pin):
        cur.close()
        return jsonify({"error": "Old PIN is incorrect"}), 401

    new_hashed = bcrypt.generate_password_hash(new_pin).decode("utf-8")
    update_user_pin(cur, user_id, new_hashed)
    db.connection.commit()
    cur.close()

    return jsonify({"message": "PIN updated successfully ✅"}), 200


# ════════════════════════════════════════════════════
if __name__ == "__main__":
    app.run(debug=True, port=5000)


# ── Contacts table in schema.sql ──────────────────────
# CREATE TABLE contacts (
#   id INT AUTO_INCREMENT PRIMARY KEY,
#   user_id INT NOT NULL,
#   name VARCHAR(100) NOT NULL,
#   phone VARCHAR(15) NOT NULL,
#   relation VARCHAR(50) DEFAULT 'Other',
#   is_primary BOOLEAN DEFAULT FALSE,
#   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
# );

@app.route("/api/contacts", methods=["GET"])
@jwt_required()
def get_contacts():
    user_id = get_jwt_identity()
    cur = db.connection.cursor()
    cur.execute("SELECT * FROM contacts WHERE user_id = %s ORDER BY is_primary DESC", (user_id,))
    contacts = cur.fetchall()
    cur.close()
    return jsonify(contacts), 200


@app.route("/api/contacts", methods=["POST"])
@jwt_required()
def add_contact():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data.get("name") or not data.get("phone"):
        return jsonify({"error": "Name and phone required"}), 400

    cur = db.connection.cursor()

    # Check limit
    cur.execute("SELECT COUNT(*) as cnt FROM contacts WHERE user_id = %s", (user_id,))
    if cur.fetchone()["cnt"] >= 4:
        cur.close()
        return jsonify({"error": "Maximum 4 contacts allowed"}), 400

    # If new primary, unset existing primary
    if data.get("is_primary"):
        cur.execute("UPDATE contacts SET is_primary = FALSE WHERE user_id = %s", (user_id,))

    cur.execute("""
        INSERT INTO contacts (user_id, name, phone, relation, is_primary)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, data["name"], data["phone"],
          data.get("relation", "Other"), data.get("is_primary", False)))
    db.connection.commit()
    new_id = cur.lastrowid
    cur.close()

    return jsonify({"message": "Contact saved", "id": new_id}), 201


@app.route("/api/contacts/<int:contact_id>", methods=["DELETE"])
@jwt_required()
def delete_contact(contact_id):
    user_id = get_jwt_identity()
    cur = db.connection.cursor()
    cur.execute("DELETE FROM contacts WHERE id = %s AND user_id = %s", (contact_id, user_id))
    db.connection.commit()
    affected = cur.rowcount
    cur.close()
    if not affected:
        return jsonify({"error": "Contact not found"}), 404
    return jsonify({"message": "Contact deleted"}), 200