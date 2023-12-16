const express=require('express')
// const { rootCertificates } = require('tls')
const app=express()
const server=require('http').Server(app)     //which helps to create the server which we ar using in socket IO
const io=require('socket.io')(server)   //we are passing the server to the socket here, which helps to socket which server is using and how to interact with it
const { v4:uuidV4 }=require('uuid')

app.set('view engine','ejs')  //what we are rendereing as the view
app.use(express.static('public'))

app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)   // we are redirecting th euser to some dynamic room which we initailly installled the UUID which we are getting fromt the below "app.get:room"
})

//now calling each time the uuidV4 it creating the Random room id each time "d66cee59-3083-448d-8cb5-1c01557ee676"

app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
}) 

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        io.to(roomId).emit('user-connected', userId);

        socket.on('disconnect', () => {
            io.to(roomId).emit('user-disconnected', userId);
        });
    });
});




server.listen(3000);