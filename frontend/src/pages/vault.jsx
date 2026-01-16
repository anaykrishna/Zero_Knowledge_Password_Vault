import { useState, useEffect } from "react";
import { apiRequest } from "../api/client.js";
import { decryptText, encryptText } from "../crypto/encrypt.js";

export default function Vault({ token, cryptoKey }) {
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editService, setEditService] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');

  // Load vault on component mount
  useEffect(() => {
    if (!token || !cryptoKey) return;

    async function loadVault() {
      try {
        const data = await apiRequest("/vault", "GET", null, token);
        console.log(data);

        const decrypted = await Promise.all(
          data.map(async (item) => {
            const encrypted = {
              iv: new Uint8Array(item.encrypted_password.iv),
              data: new Uint8Array(item.encrypted_password.data),
            };

            return {
              ...item,
              password: await decryptText(cryptoKey, encrypted),
            };
          })
        );

        setEntries(decrypted);
      } catch (err) {
        console.log(err);
        alert("Failed to fetch data");
      }
    }

    loadVault();
  }, [token, cryptoKey]);

  async function handleDelete(entryId) {
    if (!window.confirm("Are you sure you want to delete this password?")) {
      return;
    }

    try {
      await apiRequest(`/vault/${entryId}`, "DELETE", null, token);
      console.log("Password Deleted Successfully");
      setEntries(entries.filter(entry => entry.id !== entryId));
      alert("Password deleted successfully");
    } catch (err) {
      alert(err.message || "Failed to delete password");
    }
  }

  function startEdit(entry){
    setEditingId(entry.id);
    setEditService(entry.service);
    setEditUsername(entry.username);
    setEditPassword(entry.password);
  }

  function cancelEdit(){
    setEditingId(useState(null));
    setEditUsername
  }

  async function handleSave(e) {
    e.preventDefault();

    try {
      const encryptedPassword = await encryptText(cryptoKey, password);
      const encryptedString = JSON.stringify({
        iv: Array.from(encryptedPassword.iv),
        data: Array.from(encryptedPassword.data),
      });

      await apiRequest(
        "/vault",
        "POST",
        {
          service,
          username,
          encrypted_password: encryptedString,
        },
        token
      );

      alert("Password Saved Successfully");
      setService('');
      setUsername('');
      setPassword('');

      // Reload vault to show new entry
      const data = await apiRequest("/vault", "GET", null, token);
      const decrypted = await Promise.all(
        data.map(async (item) => {
          const encrypted = {
            iv: new Uint8Array(item.encrypted_password.iv),
            data: new Uint8Array(item.encrypted_password.data),
          };

          return {
            ...item,
            password: await decryptText(cryptoKey, encrypted),
          };
        })
      );
      setEntries(decrypted);
    } catch (err) {
      alert(err.message || "Failed to save password");
    }
  }

  return (
    <>
      <form onSubmit={handleSave}>
        <h2>Vault</h2>

        <input
          placeholder="Service"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <input
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Save</button>
      </form>

      <hr />

      <h3>Saved Passwords</h3>

      {entries.length === 0 && <p>No entries yet</p>}

      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.service}</strong>
            <p>Username: {entry.username}</p>
            <p>Password: {entry.password}</p>
            <button onClick={() => handleDelete(entry.id)}>Delete</button>
          </li>
        ))}
      </ul>

      
    </>
  );
}