const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const redux = require('redux');
const port = 41234;
const serverIp = '138.68.57.199';
const GET_STATE = Buffer.from('GET_STATE');
const initialState = {};
const store = redux.createStore(function(state, action) {
  switch (action.type) {
    case 'SET_STATE': {
      return action.state
    }
  }
  return initialState;
});
const sendBuilder = socket => (obj) => {
  socket.send(Buffer.from(
    obj.constructor == Object ?
      JSON.stringify(obj) : obj
  ), port, serverIp, (err) => {
    if ( err ) throw err;
  });
}
var send = sendBuilder(client);

client.on('message', (msg, rinfo) => {
  var action = JSON.parse(msg.toString());
  console.log(action);
  store.dispatch(action);
  console.log(store.getState());
});

send(GET_STATE);

setInterval(function() {
  send({ type: 'MOVE_UP' });
  send(GET_STATE);
}, 2000);
