const API_URL = 'http://localhost:3000/api';

export async function apiRequest(path, method, body, token = null){
  const headers = {
    'Content-Type' : 'application/json'
  };

  if(token){
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body : body ? JSON.stringify(body) : null,
  });

  const data = await res.json();

  if(!res.ok){
    throw new Error(data.error || "Request Failed");
  }

  return data;
}