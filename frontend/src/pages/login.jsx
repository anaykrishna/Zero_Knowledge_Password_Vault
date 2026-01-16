import { useState } from "react";
import { apiRequest } from "../api/client.js";
import { useNavigate } from "react-router-dom";
import { deriveKey } from "../crypto/keyDerivation.js";

export default function Login({ setToken , setCryptoKey}){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function handleLogin(e){
    e.preventDefault();

    try{
      // Request database for Login Credentials
      const data = await apiRequest("/auth/login", "POST", { email, password });
      
      console.log("Login response:", data);

      // Invalid Credentials
      if (!data || !data.token){
        throw new Error("Login failed(NO TOKEN)");
      }

      // Set token in state
      setToken(data.token);

      // Use the salt returned from the server to derive the same key
      const salt = new Uint8Array(data.salt);  // Convert array back to Uint8Array
      const CryptoKey = await deriveKey(password, salt);

      // Set key in state
      setCryptoKey(CryptoKey);
      if (CryptoKey) {
        console.log("Navigating to vault");
      }

      alert("Login Successful");
      navigate("/vault");

    } catch (err) {
      console.error("Login error:", err);
      alert(err.message);
    }
  }

  return(
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type='password'
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}