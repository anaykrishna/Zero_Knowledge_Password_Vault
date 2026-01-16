import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import Register from './pages/Register.jsx'
import Login from './pages/login.jsx';
import Vault from './pages/vault.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App(){
  const [token, setToken] = useState(null);
  const [cryptoKey, setCryptoKey] = useState(null);

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />}></Route>

        <Route 
          path="/login" 
          element={<Login setToken={setToken} setCryptoKey={setCryptoKey} />}>
        </Route>

        <Route 
          path="/vault" 
          element={
            <ProtectedRoute token={token} cryptoKey={cryptoKey}>
              <Vault />   
            </ProtectedRoute>
          }>
        </Route>
      </Routes>
    </BrowserRouter>
  );//to pass the cryto adn token values to the vault, i have used React.cloneElement in the protected routes
}