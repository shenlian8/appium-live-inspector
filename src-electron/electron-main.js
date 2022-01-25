import {app, BrowserWindow, ipcMain, nativeTheme} from 'electron'
import path from 'path'
import os from 'os'
import sessionReader from "./session-reader";
import appiumReader from "./appium-requester";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
}
catch (_) { }

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1200,
    height: 800,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    //mainWindow.webContents.openDevTools()
  }
  else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on("requestAppium", (event, args) => {
  appiumReader.requestAppium(args, function (result) {
      mainWindow.send("updateImage", result);
    },
    function(result) {
      mainWindow.send("updateElementView", result);
    },
    function(result) {
      mainWindow.send("updateTreeView", result);
    },
    function(errorMessage) {
      mainWindow.send("generalError", errorMessage);
    });
});

ipcMain.on("getSessionIds", (event, args) => {
  sessionReader.getSessionIds(args,
    function (result) {
      mainWindow.send("updateSessionIds", result);
    },
    function(errorMessage) {
      mainWindow.send("generalError", errorMessage);
    });
});
