import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this")
    
    # MySQL
    MYSQL_HOST = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "yourpassword")
    MYSQL_DB = os.getenv("MYSQL_DB", "prahari_db")
    MYSQL_CURSORCLASS = "DictCursor"  # Returns rows as dicts
    
    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-change-this")
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds