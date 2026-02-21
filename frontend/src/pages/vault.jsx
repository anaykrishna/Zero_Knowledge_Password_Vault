import { useState, useEffect } from "react";
import { apiRequest } from "../api/client.js";
import { decryptText, encryptText } from "../crypto/encrypt.js";

// Shared helper — avoids duplicating the decrypt-map logic in three places
async function decryptEntries(data, cryptoKey) {
  return Promise.all(
    data.map(async (item) => {
      // Bug 1 fix: encrypted_password is already an object from the API (not a string),
      // so we access .iv and .data directly — no JSON.parse needed.
      const encrypted = {
        iv:   new Uint8Array(item.encrypted_password.iv),
        data: new Uint8Array(item.encrypted_password.data),
      };
      return {
        ...item,
        password: await decryptText(cryptoKey, encrypted),
      };
    })
  );
}

export default function Vault({ token, cryptoKey }) {
  const [service, setService]   = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [entries, setEntries]   = useState([]);

  // Edit state
  const [editingId,       setEditingId]       = useState(null);
  const [editService,     setEditService]     = useState('');
  const [editUsername,    setEditUsername]    = useState('');
  const [editPassword,    setEditPassword]    = useState('');

  // ── Load vault ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !cryptoKey) return;

    async function loadVault() {
      try {
        const data = await apiRequest("/vault", "GET", null, token);
        setEntries(await decryptEntries(data, cryptoKey));
      } catch (err) {
        console.error(err);
        alert("Failed to fetch vault data");
      }
    }

    loadVault();
  }, [token, cryptoKey]);

  // ── Save new entry ───────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault();

    try {
      const encryptedPassword = await encryptText(cryptoKey, password);

      // Bug 1 fix: send as a plain object, NOT JSON.stringify.
      // The API returns it as an object, so we must store it as an object.
      await apiRequest(
        "/vault",
        "POST",
        {
          service,
          username,
          encrypted_password: {
            iv:   Array.from(encryptedPassword.iv),
            data: Array.from(encryptedPassword.data),
          },
        },
        token
      );

      setService('');
      setUsername('');
      setPassword('');

      // Refresh list
      const data = await apiRequest("/vault", "GET", null, token);
      setEntries(await decryptEntries(data, cryptoKey));
      alert("Password saved successfully");
    } catch (err) {
      alert(err.message || "Failed to save password");
    }
  }

  // ── Delete entry ─────────────────────────────────────────────────────────────
  async function handleDelete(entryId) {
    if (!window.confirm("Are you sure you want to delete this password?")) return;

    try {
      await apiRequest(`/vault/${entryId}`, "DELETE", null, token);
      setEntries(entries.filter(entry => entry.id !== entryId));
      alert("Password deleted successfully");
    } catch (err) {
      alert(err.message || "Failed to delete password");
    }
  }

  // ── Edit helpers ─────────────────────────────────────────────────────────────
  function startEdit(entry) {
    setEditingId(entry.id);
    setEditService(entry.service);
    setEditUsername(entry.username);
    setEditPassword(entry.password);   // already decrypted in state
  }

  function cancelEdit() {
    setEditingId(null);
    setEditService('');
    setEditUsername('');
    setEditPassword('');
  }

  // ── Update existing entry ────────────────────────────────────────────────────
  async function handleUpdate(e, entryId) {
    e.preventDefault();

    try {
      const encryptedPassword = await encryptText(cryptoKey, editPassword);

      await apiRequest(
        `/vault/${entryId}`,
        "PUT",
        {
          service:            editService,
          username:           editUsername,
          encrypted_password: {
            iv:   Array.from(encryptedPassword.iv),
            data: Array.from(encryptedPassword.data),
          },
        },
        token
      );

      // Update local state — no extra network round-trip needed
      setEntries(entries.map(entry =>
        entry.id === entryId
          ? { ...entry, service: editService, username: editUsername, password: editPassword }
          : entry
      ));

      cancelEdit();
      alert("Password updated successfully");
    } catch (err) {
      alert(err.message || "Failed to update password");
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Add new entry */}
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
            {/* ── Inline edit form ── */}
            {editingId === entry.id ? (
              <form onSubmit={(e) => handleUpdate(e, entry.id)}>
                <input
                  placeholder="Service"
                  value={editService}
                  onChange={(e) => setEditService(e.target.value)}
                />
                <input
                  placeholder="Email"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                />
                <button type="submit">Update</button>
                <button type="button" onClick={cancelEdit}>Cancel</button>
              </form>
            ) : (
              /* ── Read-only view ── */
              <>
                <strong>{entry.service}</strong>
                <p>Username: {entry.username}</p>
                <p>Password: {entry.password}</p>
                <button onClick={() => startEdit(entry)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}