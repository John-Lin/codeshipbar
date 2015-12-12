var menubar = require('menubar');
const ipcMain = require('electron').ipcMain;

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

mb.on('show', function ready(event, arg) {
  mb.window.webContents.send('onClick-tray-btn');
});

ipcMain.on('terminate', function() {
  mb.app.quit();
});
