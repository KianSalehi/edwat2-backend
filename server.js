let app = require('http').createServer()
let io = require('socket.io')(app, {
    allowEIO3:true,
    cors:{
        origin:"http://localhost:8080",
        methods:["GET", "POST"],
        credentials: true
    }
});
//Port listener
app.listen(8082);
console.log("server started.");
//Connection made
io.on('connection', (socket)=>{
    socket.emit('console_message', { status:'connected!'});
    socket.on('join_create_room',  (roomName)=>{
        if(roomName.length>0){
            console.log(roomName)
            socket.join(roomName);
            socket.room = roomName;
            io.in(socket.room).emit('SOCKET_addNewMessage', {
                message:'New User Joined!',
                user: "Server",
                roomID: socket.room
            });

        } else{
            console.log('did not work!')
        }
        socket.emit('SOCKET_newRoomAction', roomName)
    })
//New message received by the server
    socket.on('NEW_MESSAGE', (payload)=>{
        console.log(payload);
        io.in(payload.roomID).emit('SOCKET_addNewMessage', {...payload})
    });

})