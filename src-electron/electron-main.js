import {app, BrowserWindow, ipcMain, nativeTheme} from 'electron'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import os from 'os'
import appiumReader from "./appium-requester";

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
  if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
  }
}
catch (_) { }

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
      preload: process.env.QUASAR_ELECTRON_PRELOAD
        ? path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
        : path.resolve(__dirname, 'preload/electron-preload.cjs')
    }
  })

  const appUrl = process.env.APP_URL
  const fallbackUrl = pathToFileURL(path.join(__dirname, 'index.html')).href
  if (!appUrl) {
    console.error('APP_URL is not set. Falling back to local index.html')
  }

  try {
    mainWindow.loadURL(appUrl || fallbackUrl)
  } catch (err) {
    console.error('Failed to load app URL:', err)
  }

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
