var menubar = require('menubar');
var ipc = require('ipc');

var mb = menubar({
  dir: __dirname + '/app',
  width: 300,
  height: 550,
  preloadWindow: true,
});

mb.on('ready', function ready() {
  // mb.window.toggleDevTools();
  console.log('app is ready');
});

ipc.on('terminate', function() {
  mb.app.quit();
});
