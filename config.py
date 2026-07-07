import os
class Config:
    SECRET_KEY        = "prahari-secret-key-2024"
    MYSQL_HOST        = "prahari-prahariv5.e.aivencloud.com"
    MYSQL_USER        = "avnadmin"
    MYSQL_PASSWORD    = "AVNS_aPpI0KOkZycEyEVh6t-"
    MYSQL_DB          = "defaultdb"
    MYSQL_CURSORCLASS = "DictCursor"
    JWT_SECRET_KEY           = "prahari-jwt-secret-2024"
    JWT_ACCESS_TOKEN_EXPIRES = 86400           # 24 hours

    # ── Fast2SMS ──────────────────────────────────────────
    # 1. Sign up free at https://www.fast2sms.com
    # 2. Go to: API → Dev API → copy your API key
    # 3. Paste it below (or move to .env for security)
    FAST2SMS_API_KEY = "piJgjYqBToxz3sudakmZR9rM4QcKvWSwfhyH1CUOPn25l0tGbArqWNjsfE7cLVJQGHKPTYxk4ZCg3tOD"
