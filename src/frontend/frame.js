const remote = require('electron').remote;


const closeBtn = document.querySelector('close');
const minimizeBtn = document.querySelector('minimize');
const maximizeBtn = document.querySelector('maximize');

const win = remote.getCurrentWindow();

closeBtn.addEventListener('click', function (e) {
  win.close();
});

minimizeBtn.addEventListener('click', function (e) {
  win.minimize();
});

maximizeBtn.addEventListener('click', function (e) {
  if (win.isMaximized()) win.unmaximize(); 
  else win.maximize();
});