// make connection
var socket = io.connect('http://localhost:4000');

// Query document

var message = document.getElementById('message');
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// emit events
btn.addEventListener('click', function(){
  socket.emit('chat', {
    message: message.value,
    handle: handle.value
  })
});

// keypress event
message.addEvenentListener('keypress', function(){
  socket.emit('typing', handle.value)
});

// listen to addEventListener
socket.on('chat', function(data){
  feedback.innerHTML = "";
  output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message + '</p>';
});
socket.on('typing', function(data){
  feedback.innerHTML = '<p><em>' + data + 'is aan het typen..</em></p>';
});
