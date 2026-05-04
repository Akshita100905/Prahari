# Helper functions for DB queries — keeps app.py clean

def get_user_by_phone(cursor, phone):
    cursor.execute("SELECT * FROM users WHERE phone_number = %s", (phone,))
    return cursor.fetchone()

def get_user_by_id(cursor, user_id):
    cursor.execute(
        "SELECT id, full_name, phone_number, gender, "
        "date_of_birth, area_pin_code, is_specially_abled, created_at "
        "FROM users WHERE id = %s", (user_id,)
    )
    return cursor.fetchone()

def create_user(cursor, data, hashed_pin):
    cursor.execute("""
        INSERT INTO users 
        (full_name, phone_number, gender, date_of_birth, 
         area_pin_code, is_specially_abled, login_pin)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        data["full_name"],
        data["phone_number"],
        data["gender"],
        data["date_of_birth"],
        data["area_pin_code"],
        data.get("is_specially_abled", False),
        hashed_pin
    ))
    return cursor.lastrowid

def update_user_pin(cursor, user_id, new_hashed_pin):
    cursor.execute(
        "UPDATE users SET login_pin = %s WHERE id = %s",
        (new_hashed_pin, user_id)
    )