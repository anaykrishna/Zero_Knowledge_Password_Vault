export async function getKeyMaterial(password){
  const enc = new TextEncoder();

  return crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name : "PBKDF2" },
    false,
    ['deriveKey']
  );
}

export async function deriveKey(password, salt){
  const keyMaterial = await getKeyMaterial(password);

  return crypto.subtle.deriveKey(
    {
      name : 'PBKDF2',
      salt,
      iterations : 100_00,
      hash : 'SHA-256',   
    },
    keyMaterial,
    { 
      name : 'AES-GCM',
      length : 256,   
    },
    false,
    ['encrypt', 'decrypt']
  );
}