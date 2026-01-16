import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute( {token, cryptoKey, children} ){
  if (!token || !cryptoKey){
    return <Navigate to="/login" replace />
  }

  return React.cloneElement(children, {   //export the variables so that vault can access it
    token,
    cryptoKey,
  });
}