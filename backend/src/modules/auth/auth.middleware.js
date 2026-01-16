import { verifyToken } from "./jwt.js";

export default function authMiddleware(req, res, next){
  const authHeader = req.headers.authorization

  if (!authHeader){
    return res.status(401).json({ error : 'Missing token'});
  }

  const token = authHeader.split(' ')[1];

  try{
    const payload = verifyToken(token);
    req.user = { id : payload.userId };
    next();
  } catch{
    return res.status(401).json({ error : 'Invalud Token'});
  }
}