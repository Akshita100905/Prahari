from flask import Flask, request, jsonify, send_from_directory

import pymysql
import pymysql.cursors
import requests as http_requests
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
from flask_cors import CORS
from config import Config
from models import get_user_by_phone, get_user_by_id, create_user, update_user_pin
import re
import firebase_admin
from firebase_admin import credentials, auth
 
app = Flask(__name__)
app.config.from_object(Config)
 

class MySQL:
    def __init__(self, app=None):
        self.app = None
        self.connection = None
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.app = app

    def connect(self):
        if self.connection is None:
            self.connection = pymysql.connect(
                host=self.app.config["MYSQL_HOST"],
                user=self.app.config["MYSQL_USER"],
                password=self.app.config["MYSQL_PASSWORD"],
                database=self.app.config["MYSQL_DB"],
                port=14550, # Force connection to your exact Aiven port
                cursorclass=pymysql.cursors.DictCursor # Native dictionary cursor support
            )
        return self.connection

    def cursor(self):
        return self.connect().cursor()

    def commit(self):
        return self.connect().commit()

    def close(self):
        if self.connection:
            self.connection.close()
            self.connection = None
 
db     = MySQL(app)
bcrypt = Bcrypt(app)
jwt    = JWTManager(app)
CORS(app, origins="*")
 
 
# ─────────────────────────────────────────
# Serve HTML file at root
# ─────────────────────────────────────────
@app.route("/")
def index():
    return send_from_directory(".", "prahari-v3 (1).html")
 
@app.route("/logo.png")
def logo():
    return send_from_directory(".", "logo.png")
 
# ─────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────
def valid_phone(p):
    return bool(re.match(r"^\d{10}$", p))
 
def valid_pin(p):
    return bool(re.match(r"^\d{4,}$", p))   # 4 or more digits/chars
 
 
# ═════════════════════════════════════════
# AUTH ROUTES
# ═════════════════════════════════════════
 
@app.route("/api/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400
 
    required = ["full_name", "phone_number", "gender",
                "date_of_birth", "area_pin_code", "login_pin"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400
 
    if not valid_phone(str(data["phone_number"])):
        return jsonify({"error": "Phone must be exactly 10 digits"}), 400
 
    if len(str(data["login_pin"])) < 4:
        return jsonify({"error": "PIN must be at least 4 digits"}), 400
 
    cur = db.cursor()
    if get_user_by_phone(cur, data["phone_number"]):
        cur.close()
        return jsonify({"error": "Phone number already registered"}), 409
 
    hashed_pin = bcrypt.generate_password_hash(
        str(data["login_pin"])
    ).decode("utf-8")
 
    user_id = create_user(cur, data, hashed_pin)
    db.commit()
    cur.close()
 
    token = create_access_token(identity=str(user_id))
    return jsonify({
        "message": "Account created successfully!",
        "token":   token,
        "user": {
            "id":           user_id,
            "full_name":    data["full_name"],
            "phone_number": data["phone_number"]
        }
    }), 201
 
@app.route("/api/auth/signin", methods=["POST"])
def signin():
    data  = request.get_json()
    if not data:
        return jsonify({"error": "No data received"}), 400

    phone = data.get("phone_number", "").strip()
    pin   = str(data.get("login_pin", "")).strip()

    if not phone or not pin:
        return jsonify({"error": "Phone number and PIN are required"}), 400

    cur  = db.cursor()
    user = get_user_by_phone(cur, phone)
    cur.close()

    if not user:
        return jsonify({"error": "No account found with this phone number"}), 404

   
    if not bcrypt.check_password_hash(user["login_pin"], pin):
        return jsonify({"error": "Incorrect PIN. Try again."}), 401

    token = create_access_token(identity=str(user["id"]))
    return jsonify({
        "message": "Login successful!",
        "token":   token,
        "user": {
            "id":                 user["id"],
            "full_name":          user["full_name"],
            "phone_number":       user["phone_number"],
            "gender":             user["gender"],
            
            "is_specially_abled": bool(user.get("is_specially_abled", False))
        }
    }), 200
 
 
@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    cur     = db.cursor()
    user    = get_user_by_id(cur, user_id)
    cur.close()
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user), 200
@app.route("/api/auth/google", methods=["POST"])
def google_signin():
    data = request.get_json()
    id_token = data.get("idToken")
    
    if not id_token:
        return jsonify({"error": "Missing identity verification token"}), 400
        
    try:
        # 1. Verify the token securely with Google's servers
        decoded_token = auth.verify_id_token(id_token)
        phone_number = decoded_token.get("phone_number", "") # Optional, depends on Google Profile
        full_name    = decoded_token.get("name", "Google User")
        email        = decoded_token.get("email", "")
        
        # We will use the Google unique email prefix or unique UID to manage accounts safely
        lookup_identifier = email if email else decoded_token["uid"]
        
        cur = db.cursor()
        # 2. Check if this cloud user profile already exists in our Aiven database
        cur.execute("SELECT * FROM users WHERE phone_number = %s", (lookup_identifier,))
        user = cur.fetchone()
        
        if not user:
            # 3. Create a placeholder profile if they are logging in for the first time
            cur.execute("""
                INSERT INTO users (full_name, phone_number, gender, date_of_birth, area_pin_code, login_pin)
                VALUES (%s, %s, 'Other', '2000-01-01', '000000', 'OAUTH_ACCOUNT')
            """, (full_name, lookup_identifier))
            db.commit()
            
            cur.execute("SELECT * FROM users WHERE phone_number = %s", (lookup_identifier,))
            user = cur.fetchone()
            
        cur.close()
        
        # 4. Generate your standard local app JWT access token
        token = create_access_token(identity=str(user["id"]))
        
        return jsonify({
            "message": "Google Login successful!",
            "token":   token,
            "user": {
                "id":                 user["id"],
                "full_name":          user["full_name"],
                "phone_number":       user["phone_number"],
                "gender":             user["gender"],
                "is_specially_abled": bool(user.get("is_specially_abled", False))
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Authentication failed: {str(e)}"}), 401
 
@app.route("/api/auth/change-pin", methods=["PUT"])
@jwt_required()
def change_pin():
    user_id = get_jwt_identity()
    data    = request.get_json()
    old_pin = str(data.get("old_pin", "")).strip()
    new_pin = str(data.get("new_pin", "")).strip()
 
    if not old_pin or not new_pin:
        return jsonify({"error": "Both old and new PIN required"}), 400
 
    if len(new_pin) < 4:
        return jsonify({"error": "New PIN must be at least 4 characters"}), 400
 
    cur = db.cursor()
    cur.execute("SELECT pin_hash FROM users WHERE id = %s", (user_id,))
    row = cur.fetchone()
 
    if not row or not bcrypt.check_password_hash(row["pin_hash"], old_pin):
        cur.close()
        return jsonify({"error": "Old PIN is incorrect"}), 401
 
    new_hashed = bcrypt.generate_password_hash(new_pin).decode("utf-8")
    update_user_pin(cur, user_id, new_hashed)
    db.commit()
    cur.close()
    return jsonify({"message": "PIN updated successfully!"}), 200
 
 
# ═════════════════════════════════════════
# CONTACTS ROUTES
# ═════════════════════════════════════════
 
@app.route("/api/contacts", methods=["GET"])
@jwt_required()
def get_contacts():
    user_id = get_jwt_identity()
    cur = db.cursor()
    cur.execute(
        "SELECT * FROM contacts WHERE user_id = %s ORDER BY is_primary DESC",
        (user_id,)
    )
    contacts = cur.fetchall()
    cur.close()
    return jsonify(contacts), 200
 
# @app.route("/api/contacts", methods=["POST"])
# @jwt_required()
# def add_contact():
#     user_id = get_jwt_identity()
#     data    = request.get_json()

#     if not data.get("name") or not data.get("phone"):
#         return jsonify({"error": "Name and phone required"}), 400

#     cur = db.connection.cursor()
#     cur.execute("SELECT COUNT(*) as cnt FROM contacts WHERE user_id = %s", (user_id,))
#     if cur.fetchone()["cnt"] >= 4:
#         cur.close()
#         return jsonify({"error": "Maximum 4 contacts allowed"}), 400

#     if data.get("is_primary"):
#         cur.execute("UPDATE contacts SET is_primary = FALSE WHERE user_id = %s", (user_id,))

    # cur.execute("""
    #     INSERT INTO contacts (user_id, name, phone, relation, is_primary)
    #     VALUES (%s, %s, %s, %s, %s)
    # """, (user_id, data["name"], data["phone"],
    #       data.get("relation", "Other"), data.get("is_primary", False)))
    # db.connection.commit()
    # new_id = cur.lastrowid

    # # ── Get user name ────────────────────────────
    # cur.execute("SELECT full_name FROM users WHERE id = %s", (user_id,))
    # user = cur.fetchone()
    # cur.close()

    # user_name = user["full_name"] if user else "Someone"

    # # ── Clean phone number (remove +91, spaces) ──
    # clean_phone = data["phone"].replace("+91","").replace(" ","").replace("-","").strip()

    # # ── SMS message ───────────────────────────────
    # message = (
    #     f"Hi {data['name']}! "
    #     f"{user_name} has added you as an emergency contact in the Prahari Safety App. "
    #     f"This is an SOS emergency alert. "
    #     f"- Team Prahari"
   # )
@app.route("/api/contacts", methods=["POST"])
@jwt_required()
def add_contact():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or not data.get("name") or not data.get("phone"):
        return jsonify({"error": "Name and phone required"}), 400

    cur = db.cursor()
    cur.execute("SELECT COUNT(*) as cnt FROM contacts WHERE user_id = %s", (user_id,))
    if cur.fetchone()["cnt"] >= 4:
        cur.close()
        return jsonify({"error": "Maximum 4 contacts allowed"}), 400

    if data.get("is_primary"):
        cur.execute("UPDATE contacts SET is_primary = FALSE WHERE user_id = %s", (user_id,))

    cur.execute("""
        INSERT INTO contacts (user_id, name, phone, relation, is_primary)
        VALUES (%s, %s, %s, %s, %s)
    """, (user_id, data["name"], data["phone"],
          data.get("relation", "Other"), data.get("is_primary", False)))
    db.commit()
    new_id = cur.lastrowid

    cur.execute("SELECT full_name FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()

    user_name = user["full_name"] if user else "Someone"
    clean_ph = data["phone"].replace("+91","").replace(" ","").replace("-","").strip()

    message = (
        f"Hi {data['name']}! "
        f"{user_name} has added you as an emergency contact in the Prahari Safety App. "
        f"This is an SOS emergency alert. - Team Prahari"
    )

    sms = send_fast2sms([clean_ph], message)

    return jsonify({
        "message": "Contact saved!",
        "id": new_id,
        "sms_sent": sms["success"],
        "sms_info": sms.get("error", "SMS delivered!")
    }), 201
 
@app.route("/api/contacts/<int:contact_id>", methods=["DELETE"])
@jwt_required()
def delete_contact(contact_id):
    user_id = get_jwt_identity()
    cur = db.cursor()
    cur.execute(
        "DELETE FROM contacts WHERE id = %s AND user_id = %s",
        (contact_id, user_id)
    )
    db.commit()
    affected = cur.rowcount
    cur.close()
    if not affected:
        return jsonify({"error": "Contact not found"}), 404
    return jsonify({"message": "Contact deleted!"}), 200


# ═════════════════════════════════════════
# FAST2SMS HELPER
# ═════════════════════════════════════════
def send_fast2sms(phone_numbers: list, message: str):
    """
    Sends SMS to Indian numbers via Fast2SMS Dev API.
    phone_numbers: list of 10-digit strings e.g. ["9876543210"]
    Returns: {"success": True/False, "error": "..."}
    """
    api_key = app.config.get("FAST2SMS_API_KEY", "")
    if not api_key or api_key == "YOUR_FAST2SMS_API_KEY_HERE":
        return {"success": False, "error": "Fast2SMS API key not configured in config.py"}

    if not phone_numbers:
        return {"success": False, "error": "No valid phone numbers"}

    url = "https://www.fast2sms.com/dev/bulkV2"
    headers = {
        "authorization": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "route":    "q",                        # transactional route
        "message":  message,
        "language": "english",
        "flash":    0,
        "numbers":  ",".join(phone_numbers),    # comma-separated
    }

    try:
        resp = http_requests.post(url, json=payload, headers=headers, timeout=10)
        data = resp.json()
        if data.get("return") is True:
            return {"success": True, "response": data}
        else:
            return {"success": False, "error": data.get("message", [str(data)])}
    except http_requests.exceptions.Timeout:
        return {"success": False, "error": "Fast2SMS request timed out"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def clean_phone(raw: str) -> str:
    """Strip non-digits, remove leading +91 / 91, return 10 digits or ''"""
    num = re.sub(r"\D", "", raw)
    if num.startswith("91") and len(num) == 12:
        num = num[2:]
    return num if len(num) == 10 else ""


# ═════════════════════════════════════════
# SOS TRIGGER  — POST /api/sos/trigger
# Called by the frontend when SOS fires
# ═════════════════════════════════════════
@app.route("/api/sos/trigger", methods=["POST"])
@jwt_required()
def sos_trigger():
    user_id = get_jwt_identity()
    data    = request.get_json() or {}

    latitude   = data.get("latitude")
    longitude  = data.get("longitude")
    transcript = data.get("transcript", "")
    ps_name    = data.get("ps_name", "Nearest police station")

    # Build location link
    if latitude and longitude:
        location_link = f"https://maps.google.com/?q={latitude},{longitude}"
    else:
        location_link = "Location unavailable"

    # Fetch user + contacts
    cur  = db.cursor()
    user = get_user_by_id(cur, user_id)
    cur.execute(
        "SELECT name, phone, is_primary FROM contacts WHERE user_id = %s ORDER BY is_primary DESC",
        (user_id,)
    )
    contacts = cur.fetchall()
    cur.close()

    if not contacts:
        return jsonify({"error": "No emergency contacts saved. Add contacts first."}), 400

    user_name  = user["full_name"]    if user else "Prahari User"
    user_phone = user["phone_number"] if user else ""

    # Build SMS message (keep under 160 chars for single SMS)
    sms = (
        f"SOS ALERT! {user_name} ({user_phone}) NEEDS HELP NOW!\n"
        f"Location: {location_link}\n"
        f"PS: {ps_name}"
    )
    if transcript:
        # Append transcript only if it fits
        extra = f"\nVoice: \"{transcript[:60]}\""
        if len(sms) + len(extra) <= 320:
            sms += extra
    sms += "\n- Prahari Safety App"

    # Collect valid 10-digit numbers
    phone_numbers = [clean_phone(c["phone"]) for c in contacts if clean_phone(c["phone"])]

    if not phone_numbers:
        return jsonify({"error": "No valid 10-digit phone numbers in contacts"}), 400

    # Send via Fast2SMS
    result = send_fast2sms(phone_numbers, sms)

    # Log to DB (optional — create sos_logs table with schema below)
    try:
        log_cur = db.cursor()
        log_cur.execute("""
            INSERT INTO sos_logs (user_id, latitude, longitude, transcript, sms_sent, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
        """, (user_id, latitude, longitude, transcript, result["success"]))
        db.commit()
        log_cur.close()
    except Exception:
        pass  # sos_logs table might not exist yet — non-critical

    if result["success"]:
        return jsonify({
            "message":          f"SOS SMS sent to {len(phone_numbers)} contact(s)!",
            "contacts_alerted": len(phone_numbers),
            "location":         location_link,
        }), 200
    else:
        return jsonify({
            "error":   "SMS sending failed",
            "details": result.get("error"),
        }), 500


# ═════════════════════════════════════════
# SOS CANCEL — POST /api/sos/cancel
# Notifies contacts that SOS was cancelled
# ═════════════════════════════════════════
@app.route("/api/sos/cancel", methods=["POST"])
@jwt_required()
def sos_cancel():
    user_id = get_jwt_identity()

    cur  = db.cursor()
    user = get_user_by_id(cur, user_id)
    cur.execute("SELECT phone FROM contacts WHERE user_id = %s", (user_id,))
    contacts = cur.fetchall()
    cur.close()

    phone_numbers = [clean_phone(c["phone"]) for c in contacts if clean_phone(c["phone"])]
    user_name     = user["full_name"] if user else "Prahari User"

    if phone_numbers:
        cancel_msg = (
            f"UPDATE: {user_name} has CANCELLED the SOS alert. "
            f"They are safe. - Prahari Safety App"
        )
        send_fast2sms(phone_numbers, cancel_msg)

    return jsonify({"message": "SOS cancelled, contacts notified"}), 200


# ─────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)
