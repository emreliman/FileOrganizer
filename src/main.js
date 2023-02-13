const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron')

//Menu.setApplicationMenu(null);
const path = require('path');
console.log("yukleniyor")
let win
//const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
function createwindow() {
  win = new BrowserWindow({
    icon: "assets/logo.png",
    width: 400,
    height: 550,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, '/preload.js'),
      nativeWindowOpen: true,
      devTools: true,
    },
    title: 'File Sorting App',
    backgroundColor: '#282c34'
  })
  /*
  if (isDev) {
    win.webContents.openDevTools();
  }
  */
  win.loadURL(`file://${__dirname}/index.html`);
  win.on('closed', () => {
    win = null
  })
  ipcMain.handle('dialog:openDirectory', async () => {
    console.log("handle")
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return
    } else {
      console.log(filePaths[0])
      return filePaths[0]
    }
  })
}

function aboutLink() {
  shell.openExternal("https://emreliman.live/");
}

const menu = [
  ...(isMac
    ? [
      {
        label: app.name,

        submenu: [
          {
            label: 'About Author',
            click: aboutLink,
          },
        ],
      },
    ]
    : []),
  ...(!isMac
    ? [
      {
        label: 'Help',
        submenu: [
          {
            label: 'About Author',
            click: aboutLink,
          },
        ],
      },
    ]
    : []),
  {
    role: 'quit',
  },
];

app.on('ready', () => {
  createwindow();
  /*
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  */

})
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
  win = null;
});