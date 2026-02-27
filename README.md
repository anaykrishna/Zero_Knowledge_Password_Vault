# 🔐 Zero Knowledge Password Vault

A secure, client-side password management application that implements zero-knowledge architecture. Your passwords are encrypted locally using the Web Crypto API and never transmitted to the server in plaintext — not even the server can read them.

## Features

- **Zero-Knowledge Architecture** - Passwords are encrypted on your device before being sent anywhere
- **AES-256-GCM Encryption** - Industry-standard encryption with a unique IV per entry
- **PBKDF2 Key Derivation** - Master password is never sent to the server; used only to derive the encryption key locally (100,000 iterations)
- **No Server-Side Decryption** - The server stores only ciphertext and never has access to your master password or keys
- **JWT Authentication** - Stateless, token-based auth with 1-hour expiry
- **bcrypt Password Hashing** - Master password is hashed with 12 salt rounds before storage
- **SQL Injection Prevention** - All queries use parameterized statements

## How It Works

1. **Registration** - A unique random salt is generated server-side and stored against your account
2. **Login** - The salt is returned to the browser; combined with your master password it derives an AES-256 key via PBKDF2 — this key never leaves your device
3. **Encryption** - Every password is encrypted with AES-256-GCM in the browser before being sent to the server
4. **Storage** - The server stores only the ciphertext (`{ iv, data }`) — it has no way to decrypt it
5. **Retrieval** - Encrypted data is fetched and decrypted entirely on your device using the in-memory key

## Tech Stack

### Frontend
- **React + Vite** - Component-based UI with fast dev server
- **React Router** - Client-side routing and protected routes
- **Web Crypto API** - Native browser API for AES-256-GCM encryption and PBKDF2 key derivation

### Backend
- **Node.js + Express** - REST API server
- **PostgreSQL** - Relational database for users and vault entries
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT signing and verification

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL running locally

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/anaykrishna/Zero_Knowledge_Password_Vault.git
   cd Zero_Knowledge_Password_Vault
   ```

2. **Set up the database**

   Create a PostgreSQL database and run the following schema:
   ```sql
   CREATE TABLE users (
     id               SERIAL PRIMARY KEY,
     email            TEXT UNIQUE NOT NULL,
     password_hash    TEXT NOT NULL,
     encryption_salt  BYTEA NOT NULL
   );

   CREATE TABLE vault_entries (
     id                 SERIAL PRIMARY KEY,
     user_id            INTEGER REFERENCES users(id) ON DELETE CASCADE,
     service            TEXT NOT NULL,
     username           TEXT NOT NULL,
     encrypted_password JSONB NOT NULL,
     created_at         TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Configure environment variables**

   Create a `.env` file inside the `backend/` folder:
   ```env
   DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_db
   JWT_SECRET=your_secret_key_here
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Server runs on `http://localhost:3000`

5. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs on `http://localhost:5173`

## Usage

### Creating an Account
1. Go to `/register`
2. Enter your email and choose a strong master password
3. Your account is created — a unique encryption salt is generated for you

### Adding a Password
1. Log in with your master password
2. Enter the service name, username/email, and password in the vault form
3. Click **Save** — the password is encrypted in your browser before being stored

### Viewing Passwords
1. All entries load decrypted automatically after login (decryption happens in-browser)
2. Passwords are hidden by default — click 👁 to reveal an individual entry

### Editing & Deleting Passwords
1. Click **Edit** on any entry to modify it inline — the updated password is re-encrypted before saving
2. Click **Delete** to permanently remove an entry

## Security Considerations

- **Master Password** - Choose a strong, unique master password. If lost, passwords cannot be recovered since the server has no way to derive your key
- **No Recovery Option** - For security, there is no password recovery. Store your master password safely
- **Local Encryption** - All encryption and decryption happens on your device; only ciphertext is ever transmitted
- **HTTPS Only** - Always deploy behind HTTPS in production to protect data in transit
- **Browser Security** - Keep your browser and OS updated for maximum security

## Project Structure

```
Zero_Knowledge_Password_Vault/
├── backend/
│   ├── server.js
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   └── modules/
│       ├── auth/
│       │   ├── auth.controller.js
│       │   ├── auth.middleware.js
│       │   ├── auth.routes.js
│       │   ├── auth.service.js
│       │   ├── jwt.js
│       │   └── password.js
│       └── vault/
│           ├── vault.controller.js
│           ├── vault.routes.js
│           └── vault.service.js
├── frontend/
│   └── src/
│       ├── api/
│       │   └── client.js
│       ├── components/
│       │   └── ProtectedRoute.jsx
│       ├── crypto/
│       │   ├── encrypt.js
│       │   └── keyDerivation.js
│       ├── pages/
│       │   ├── login.jsx
│       │   ├── Register.jsx
│       │   └── vault.jsx
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Login — returns JWT and encryption salt |

### Vault (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vault` | Retrieve all encrypted entries |
| POST | `/api/vault` | Save a new encrypted entry |
| PUT | `/api/vault/:id` | Update an existing entry |
| DELETE | `/api/vault/:id` | Delete an entry |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Limitations

- Master password cannot be recovered if forgotten — this is by design
- Passwords are only as secure as the strength of your master password
- Browser vulnerabilities could theoretically expose decrypted data held in memory

## Author

**anaykrishna** - [GitHub Profile](https://github.com/anaykrishna)

---

**Stay secure. Stay private.**
