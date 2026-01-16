import * as authService from './auth.service.js'

export async function login(req, res) {
  try{
    const {email, password} = req.body;
    const { token, salt } = await authService.loginUser(email, password);
    res.json({ token, salt });  // Send salt to frontend
  }catch{
    res.status(401).json({ error : 'Invalid Credentials'})
  }
}

export async function register(req, res){
  const {email, password} = req.body;

  await authService.registerUser(email, password);

  res.status(201).json({ message : "User Registered"});
}