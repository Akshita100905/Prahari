# Prahari
Prahari is a web-based safety application designed to provide instant emergency assistance, real-time location tracking, and secure communication during critical situations. The system focuses on enhancing personal safety by enabling users to quickly alert trusted contacts and authorities with minimal effort.

The application features a user-friendly dashboard where individuals can securely log in using a PIN-based authentication system or Google Sign-In, ensuring both accessibility and security. In emergency scenarios, users can activate a one-tap SOS button, which triggers alerts, shares live location, and initiates safety protocols.

The platform integrates real-time map services to help users navigate to nearby safe locations such as police stations. It also supports voice-triggered commands, allowing hands-free activation of emergency alerts. Additionally, an offline SMS fallback mechanism ensures alerts can still be sent even without internet connectivity.

On the backend, the system uses a Flask-based REST API to manage authentication, user data, and emergency contacts. Sensitive information such as login PINs is securely handled using encryption techniques, and user sessions are maintained using token-based authentication (JWT). Data is stored in a MySQL database, ensuring reliability and scalability.

Overall, Prahari provides a comprehensive, secure, and intelligent safety solution, combining modern web technologies with practical real-world use cases to improve emergency response and personal security.

🎯 Key Objectives
Provide instant emergency alert system
Enable real-time location sharing
Ensure secure user authentication
Support quick access to emergency services
Work reliably even in low connectivity scenarios

⭐ Key Features
🚨 One-tap SOS alert system
📍 Live location tracking (map integration)
🎤 Voice-activated emergency trigger
🔐 Secure login with PIN & JWT
👥 Emergency contacts management
📶 Offline SMS fallback
🌐 Google Sign-In integration (in future)
