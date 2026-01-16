import 'dotenv/config';
import http from 'http';
import app from './app.js';

const server = http.createServer(app)

server.listen(3000, () => {
  console.log("The server is running on port 3000");
});



