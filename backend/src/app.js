import express from 'express';
import cors from 'cors';    //solving cross origin access
import vaultRoutes from "./modules/vault/vault.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(cors({                          //cors first then express.json then routes.
  origin: 'http://localhost:5173',
}));

app.use(express.json());   //converting raw bytes into json format
app.use('/api/vault', vaultRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send("App is running");
});

app.post('/api/test', (req, res) => {
  const data = req.body
  res.json({
    recieved : data,
  });
});


export default app;