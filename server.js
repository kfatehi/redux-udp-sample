const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const redux = require('redux');
const spawnPosition = { x: 0, y: 0 };
const initialState = { position: spawnPosition };
const socketReplyBuilder = (socket) => (rinfo) => (obj) => {
  socket.send( Buffer.from(
    obj.constructor == Object ?
    JSON.stringify(obj) : obj
  ), rinfo.port, rinfo.address, (err) => {
    if (err) throw err;
  });
}
const store = redux.createStore(function(state, action) {
  switch (action.type) {
    case 'MOVE_UP': {
      return {
        position: {
          x: state.position.x,
          y: state.position.y+1,
        }
      }
    }
  }
  return initialState;
});
const replyBuilder = socketReplyBuilder(server);

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  var reply = replyBuilder(rinfo);
  var str = msg.toString();
  switch (str) {
    case 'GET_STATE': {
      return reply({
        type: 'SET_STATE',
        state: store.getState()
      });
    }
    default: {
      try {
        return store.dispatch(JSON.parse(str));
      } catch (e) {
        console.error(e);
      }
    }
  }
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
