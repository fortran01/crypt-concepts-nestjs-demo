# Cryptographic Concepts Demo (NestJS Version)

This NestJS application demonstrates various cryptographic concepts including password hashing, encryption/decryption, and encoding/decoding workflows. It provides an interactive interface to understand how these processes work.

## Features

- Password hashing with multiple algorithms (SHA-256, SHA-3, BCrypt, Argon2)
- Demonstration of salt and pepper usage in password hashing
- Data encryption and decryption using Node's crypto module
- Base64 encoding/decoding demonstration
- Interactive UI showing each step of the process
- Performance timing for different algorithms
- Adjustable work factors for password hashing

## Setup Instructions

```bash
# Install dependencies
npm install

# Run the application in development mode
npm run start:dev

# Build and run in production mode
npm run build
npm run start:prod
```

Open your web browser and navigate to: http://localhost:3000

## Usage

### Password Hashing

1. Enter a sample password
2. Choose a hashing algorithm from the dropdown
3. Adjust the work factor (for BCrypt and Argon2)
4. Submit to see the complete hashing process

### Encryption/Decryption

1. Enter data to encrypt
2. View the encryption process steps
3. See the Base64 encoded result
4. Decrypt to verify the original data

## Security Note

This is a demonstration application intended for educational purposes. In a production environment, additional security measures would be necessary.
