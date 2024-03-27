import http from 'node:http';
import app from './app.js';
import 'dotenv/config';

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

// can you add a print fucntion below

/**
 * Listen on provided port, on all network interfaces.
 */
const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

server.listen(port);

server.on("listening", () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Server is running and listening on ${bind}`);
});

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  switch (error.code) {
    case 'EACCES': {
      console.error(`Port ${port} requires elevated privileges`);
      process.exit(1);
      break;
    }
    case 'EADDRINUSE': {
      console.error(`Port ${port} is already in use`);
      process.exit(1);
      break;
    }
    default:
      throw error;
  }
});
