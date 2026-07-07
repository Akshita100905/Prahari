CREATE TABLE IF NOT EXISTS users (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    full_name         VARCHAR(100) NOT NULL,
    phone_number      VARCHAR(10)  UNIQUE NOT NULL,
    gender            ENUM('Male','Female','Other') NOT NULL,
    date_of_birth     DATE NOT NULL,
    area_pin_code     VARCHAR(6) NOT NULL,
    is_specially_abled BOOLEAN DEFAULT FALSE,
    login_pin         VARCHAR(255) NOT NULL,
    google_id         VARCHAR(255) DEFAULT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
CREATE TABLE IF NOT EXISTS contacts (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    name       VARCHAR(100) NOT NULL,
    phone      VARCHAR(15)  NOT NULL,
    relation   VARCHAR(50)  DEFAULT 'Other',
    is_primary BOOLEAN      DEFAULT FALSE,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- SOS event log (auto-created on first SOS trigger)
CREATE TABLE IF NOT EXISTS sos_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  latitude    DECIMAL(10, 7),
  longitude   DECIMAL(10, 7),
  transcript  TEXT,
  sms_sent    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
