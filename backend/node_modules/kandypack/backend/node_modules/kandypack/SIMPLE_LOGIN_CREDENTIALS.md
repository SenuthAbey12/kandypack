# KandyPack Simple Login Credentials

## For Testing Purposes - Simple Passwords with High Security Hashing

### ADMIN ACCOUNTS
- **Username:** admin
- **Password:** admin123
- **Role:** admin

### CUSTOMER ACCOUNTS
- **Username:** john | **Password:** john123 | **Name:** John Doe
- **Username:** jane | **Password:** jane123 | **Name:** Jane Smith  
- **Username:** bob | **Password:** bob123 | **Name:** Bob Wilson
- **Username:** alice | **Password:** alice123 | **Name:** Alice Brown

### DRIVER ACCOUNTS
- **Username:** saman | **Password:** saman123 | **Name:** Saman Perera
- **Username:** kamal | **Password:** kamal123 | **Name:** Kamal Silva
- **Username:** nimal | **Password:** nimal123 | **Name:** Nimal Fernando
- **Username:** sunil | **Password:** sunil123 | **Name:** Sunil Rathnayake

### ASSISTANT ACCOUNTS  
- **Username:** priya | **Password:** priya123 | **Name:** Priya Jayasinghe
- **Username:** chamara | **Password:** chamara123 | **Name:** Chamara Wijesekara
- **Username:** sanduni | **Password:** sanduni123 | **Name:** Sanduni Mendis
- **Username:** thilaka | **Password:** thilaka123 | **Name:** Thilaka Kumari

## Security Features
- All passwords are securely hashed using bcrypt with salt rounds: 10
- JWT tokens for session management
- Portal-based access control (Customer Portal vs Employee Portal)
- Role-based authentication and authorization

## Usage
1. Use these credentials to test different user types
2. Passwords are simple for testing but stored securely in database
3. Production system maintains full security while allowing easy testing