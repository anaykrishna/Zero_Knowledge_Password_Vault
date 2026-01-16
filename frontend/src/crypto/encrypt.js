export async function encryptText(key, plaintext){    //stores iv and data in the backend
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    { name : 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );

  return {
    iv : Array.from(iv),
    data : Array.from(new Uint8Array(ciphertext)),
  };
}

export async function decryptText(key, encrypted){    //encrypted is the data from encryptText
  const dec = new TextDecoder();

  const plaintext = await crypto.subtle.decrypt(
    {
      name : 'AES-GCM',
      iv : new Uint8Array(encrypted.iv),
    },
    key,
    new Uint8Array(encrypted.data)
  );

  return dec.decode(plaintext);
}