var playerCount = 0;
var limit = 1;
var skipcount = 0;
var connected = false;
var myID;
var cursors = [];
var socket;
window.onload = e => {
  socket = new WebSocket("wss://node2.wsninja.io");
  socket.addEventListener('open', function(event) {
    // Connection opened, send client GUID to autenticate with wsninja server.
    socket.send(JSON.stringify({ guid: "835d6995-f754-42f8-97ce-91a826dfb993" }));
  });

  // Listen for websocket messages.
  socket.onmessage = event => {
    var message = JSON.parse(event.data);
    if (message.accepted === true) {
        document.querySelector(".wait").style.display = "none";
        document.querySelector(".connected").style.display = "block";
        connected = true;
        myID = Date.now();
        document.querySelector('.id').innerHTML = myID;
    } else {
        //if there are no cursors, just add this one.
      if(cursors.length == 0) {
        cursors.push(message.id);
        newCurs(message.id);
        update(message.id, message.pos);
      } else { //if there are curors try to map trough them and find yours to update.
        var found = false;
        cursors.map(id => {
          if (id == message.id) {
            update(message.id, message.pos);
            found = true;
          }
        });
        if (!found) { //if you can't find it just push it as a new one.
          cursors.push(message.id);
          newCurs(message.id);
          update(message.id, message.pos);
        }
      }
    }
    document.querySelector('.ccu').innerHTML = cursors.length+1;
  }
}

window.onmousemove = e => {
  if(skipcount <= 0 && connected) {
    skipcount = limit;
    console.log(e);
    //TODO serve my position with id
    socket.send(JSON.stringify({ pos: {x: e.clientX, y: e.clientY}, id: myID }));
  }
  skipcount--;
}

function newCurs(id) {
  var curs = document.createElement('DIV')
  curs.setAttribute('class', 'crs');
  curs.setAttribute('id', 'curor' + id);
  document.documentElement.append(curs);
}

function update(id, pos) {
  document.querySelector('#'+'curor'+id).style.left = pos.x + "px";
  document.querySelector('#'+'curor'+id).style.top = pos.y + "px";
}
