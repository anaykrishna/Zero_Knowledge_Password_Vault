import { useState } from "react";
import { apiRequest } from "../api/client.js";


export default function Register(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleRegister(e){
    e.preventDefault();
    
    apiRequest('/auth/register', 'POST', {
      email,
      password,
    })
      .then(() => {
        alert("Registered Successfully");
      })
      .catch((err) => {
        alert(err.message)
      });
  }

  return(
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}>
      </input>

      <input 
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}>
      </input>

      <button type="submit">Register</button>
    </form>
  );
}