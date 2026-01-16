import { signToken } from "./jwt.js";
import { hashPassword, verifyPassword } from "./password.js";
import { pool } from "../../config/db.js";
import { randomBytes } from 'crypto'; 

export async function findUserByEmail(email){
  const result = await pool.query(
    'SELECT id, email, password_hash, encryption_salt FROM users where email = $1',
    [email]
  );    //$1 prevents sql injection

  return result.rows[0];
}

export async function createUser(email, passwordHash, encryptionSalt) {
  await pool.query(
    'INSERT INTO users (email, password_hash, encryption_salt) VALUES ($1, $2, $3)',
    [email, passwordHash, encryptionSalt]
  );
}

//Check email and password, return the jwt token for the userid
export async function loginUser(email, password){
  const user = await findUserByEmail(email);

  if(!user){
    throw new Error("Invalid Credentials");
  }

  const isValid = await verifyPassword(password, user.password_hash);   //user contains{email, passhash, id}

  if(!isValid){
    throw new Error("Invalid Credentials");
  }
  
  console.log(`User ${user.id} has logged in Successfully`);
  // Return both token AND the salt to derive the correct key
  return {
    token: signToken({ userId: user.id }),
    salt: Array.from(user.encryption_salt)  // Convert BYTEA to array for JSON
  };
}

export async function registerUser(email, password){
  const passwordHash = await hashPassword(password);
  const encryptionSalt = randomBytes(16);  
  await createUser(email, passwordHash, encryptionSalt);
}