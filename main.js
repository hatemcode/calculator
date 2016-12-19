const {app, BrowserWindow} = require('electron');
let mainWindow;


app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({title: "Hatem Calculator", width: 395, height: 460, transparent: true, frame: false});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
