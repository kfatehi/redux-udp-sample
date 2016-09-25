const dgram = require('dgram');
const server = dgram.createSocket('udp4');
const redux = require('redux');


server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

  var buf = Buffer.from('ServerState');

  server.send(buf, rinfo.port, rinfo.address, (err) => {
    if (err) throw err;
  });
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);
