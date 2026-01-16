# Zero Knowledge Password Vault

A secure, client-side password management application that implements zero-knowledge architecture. Your passwords are encrypted locally and never transmitted to servers in plaintext.

## Features

- **Zero-Knowledge Architecture** - Passwords are encrypted on your device before being sent anywhere
- **End-to-End Encryption** - AES encryption ensures only you can access your passwords
- **No Server-Side Decryption** - The server never has access to your master key or passwords
- **Local First** - Encryption happens entirely on your machine
- **Secure Authentication** - Master password protection for all stored credentials
- **Easy Organization** - Organize and manage multiple passwords efficiently
- **Fast & Responsive** - Modern frontend interface for quick access

## How It Works

1. **Registration** - Create a master password (never transmitted to the server)
2. **Encryption** - All passwords are encrypted locally using your master password
3. **Storage** - Only encrypted data is sent to the server
4. **Retrieval** - Data is downloaded and decrypted only on your device
5. **Privacy** - Even the server cannot access your passwords

## Tech Stack

### Frontend
- **JavaScript** - Core frontend logic
- **HTML/CSS** - User interface
- **Modern Browser APIs** - For local encryption

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/anaykrishna/Zero_Knowledge_Password_Vault.git
   cd Zero_Knowledge_Password_Vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Access the application**
   Open your browser and go to `http://localhost:3000`

## Usage

### Creating an Account
1. Click "Sign Up" on the login page
2. Create a strong master password (this is your only way to access your passwords)
3. Confirm your password

### Adding a Password
1. Log in with your master password
2. Click "Add New Password"
3. Enter the service name, username, and password
4. Click "Save" - it will be encrypted locally and stored securely

### Viewing Passwords
1. Click on any saved password entry
2. Your master password will decrypt it for viewing
3. Copy to clipboard or reveal the password

### Deleting Passwords
1. Select the password entry you want to remove
2. Click "Delete" 
3. Confirm the deletion

## Security Considerations

- **Master Password** - Choose a strong, unique master password. If lost, passwords cannot be recovered
- **No Recovery Option** - For security, there's no password recovery. Store your master password safely
- **Local Encryption** - All encryption happens on your device before transmission
- **HTTPS Only** - Always use HTTPS in production for data transmission
- **Browser Security** - Keep your browser and OS updated for maximum security

## Project Structure

```
Zero_Knowledge_Password_Vault/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── package.json
├── data_format.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /auth/register` - Create a new account
- `POST /auth/login` - Login with email and password hash

### Passwords
- `GET /api/passwords` - Retrieve all encrypted passwords
- `POST /api/passwords` - Save a new encrypted password
- `DELETE /api/passwords/:id` - Delete a password entry
- `PUT /api/passwords/:id` - Update a password entry

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security Audit

This project implements client-side encryption, but for production use, consider:
- Independent security audit
- Penetration testing
- Code review from security experts
- Compliance with data protection regulations (GDPR, etc.)

## Roadmap

- [ ] Browser extensions for Chrome and Firefox
- [ ] Mobile app (iOS/Android)
- [ ] Two-factor authentication
- [ ] Password strength indicators
- [ ] Bulk password import/export
- [ ] Dark mode
- [ ] Biometric authentication support

## Limitations

- Master password cannot be recovered if forgotten
- Passwords are only as secure as your master password strength
- Server-side security depends on proper HTTPS and server hardening
- Browser vulnerabilities could potentially expose decrypted data in memory

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, feature requests, or questions:
1. Open an issue on GitHub
2. Provide clear description of the problem
3. Include steps to reproduce (if applicable)

## Disclaimer

This application is provided "as-is" for educational purposes. While it implements zero-knowledge architecture, use it at your own risk. For storing highly sensitive credentials, consider established password managers like Bitwarden, 1Password, or KeePass.

## Author

**anaykrishna** - [GitHub Profile](https://github.com/anaykrishna)

---

**Stay secure. Stay private.**
