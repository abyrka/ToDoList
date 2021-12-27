const http = require("http");

const app = require("./app");

const { initCacheClient } = require("./utils/cache");
const connectToMongoDb = require("./utils/connectToMongoDb");

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || "8000");
app.set("port", port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

// open connection to Mongo DB
connectToMongoDb();

// init redis client
initCacheClient();

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  console.error(`Error on ${error}`);
  if (error.syscall !== "listen") {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      // console.error( `${ bind } requires elevated privileges` );
      process.exit(1);
      break;
    case "EADDRINUSE":
      // console.log( `${ bind } is already in use` );
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}
