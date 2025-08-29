export const userSocketMap = new Map();

function setupWebSocket(io) {
    io.on('connection', (socket) => {

        socket.on('authenticate', (userId) => {

            if(userId) {
                userSocketMap.set(userId, socket.id);
            }
            else {
                console.warn(`Attempted to authenticate with empty userId for socket ${socket.id}`);
            }
        });

        socket.on('disconnect', () => {
            for(let [userId, socketId] of userSocketMap.entries()) {
                if(socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });
    });
};

export default setupWebSocket;
