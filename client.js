const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const redux = require('redux');

var sendStuff = ()=> {
  var buf = Buffer.from('Stuff');
  client.send(buf, 41234, 'localhost', (err) => {
    if ( err ) throw err;
  });
}

client.on('message', (msg, rinfo) => {
  console.log(`client got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});


setInterval(function() {
  sendStuff();
}, 1000);

