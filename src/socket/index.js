import process from 'process';

const devMode = (process.env.NODE_ENV === 'development');

const init = (io) => {
    // Register io to global io state.
    global.io = io;

    // Socket.io middlewares.
    // io.use(authMiddleware.generatePayload);

    // Watch client connection.
    io.on('connection', (socket) => {
        if (devMode) console.log(`==> ${socket.id}`);

        // Register client connection to room.
        // registerToRoom(socket);

        // Disconnecting client handdle.
        socket.on('disconnect', () => {
            if (devMode) console.log(`<== ${socket.id}`);
        });
    });
};

export default { init };
