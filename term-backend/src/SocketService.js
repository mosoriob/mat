// SocketService.js

// Manage Socket.IO server
const socketIO = require("socket.io");
const PTYService = require("./PTYService");

class SocketService {
  constructor() {
    this.socket = null;
    this.pty = null;
  }

  attachServer(server) {
    if (!server) {
      throw new Error("Server not found...");
    }

    const io = socketIO(server);
    console.log("Created socket server. Waiting for client connection.");
    // "connection" event happens when any client connects to this io instance.
    io.on("connection", socket => {
      console.log("Client connect to socket.", socket.id);

      this.socket = socket;

      // Just logging when socket disconnects.
      this.socket.on("disconnect", () => {
        console.log("Disconnected Socket: ", socket.id);
      });

      // Create a new pty service when client connects.
      this.pty = new PTYService(this.socket);

      // Attach any event listeners which runs if any event is triggered from socket.io client
      // For now, we are only adding "input" event, where client sends the strings you type on terminal UI.
      this.socket.on("input", input => {
        //Runs this event function socket receives "input" events from socket.io client
        this.pty.write(input);
      });
      this.socket.on("execute", input => {
        //Runs this event function socket receives "input" events from socket.io client
        this.pty.write('\r');
      });

      this.socket.on("sigint", input => {
        //Runs this event function socket receives "input" events from socket.io client
        this.pty.write('\x03\n');
      });

    });
  }
}

module.exports = SocketService;
