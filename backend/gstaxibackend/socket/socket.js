const socketio = require('socket.io');

// Function to initialize WebSocket connections
function initializeWebSocket(server) {
  const io = socketio(server);

  // Socket.io event handlers
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle authentication event
    socket.on('authenticate', (userId) => {
      // Here you can perform authentication using the provided userId
      // For demonstration purposes, we'll simply log the userId
      console.log('Authenticated user:', userId);

      // Example of emitting an event to the client after authentication
      socket.emit('authenticated', { message: 'You are authenticated' });
    });

    // Handle other socket events as needed
    // For example, you can listen for 'disconnect' event to handle disconnections
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  return io;
}

module.exports = { initializeWebSocket };
