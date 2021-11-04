const {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  nativeImage,
} = require("electron");
const path = require("path");

let mainWindow;
let eventWindow;
let todoTray = null;

function createEventWindow() {
  eventWindow = new BrowserWindow({
    width: 300,
    // height: 150,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
    },
    show: false,
  });
  // mainWindow.setMenu(null);
  // eventWindow.setMenu(null);
  eventWindow.addListener("close", (e) => {
    eventWindow.hide();
    mainWindow.reload();
    e.preventDefault();
  });

  // console.log(path.join(__dirname, 'src/addEvent.html'))
  eventWindow.loadFile(path.join(__dirname, "src/addEvent.html"));
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 420,
    height: 450,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      enableRemoteModule: true,
    },
    show: false,
  });

  mainWindow.addListener("close", (e) => {
    // console.log(this.clearImmediate);
    mainWindow.hide();
    e.preventDefault();
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "src/todo/todo.html"));
  // mainWindow.show();
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.whenReady().then(() => {
//   createWindow()
//   // console.log(mainWindow);
//   globalShortcut.register('CommandOrControl+X', () => {
//     console.log("ctrl+x");
//     });

//   app.on('activate', function () {
//     // On macOS it's common to re-create a window in the app when the
//     // dock icon is clicked and there are no other windows open.
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

try {
  app
    .whenReady()
    .then(() => {
      createWindow();
      createEventWindow();
      todoTray = new Tray(
        nativeImage.createFromPath(path.join(__dirname, "icon.png"))
      );
      todoTray.on("click", () => {
        mainWindow.show();
      });
      globalShortcut.register("CommandOrControl+x", () => {
        eventWindow.show();
      });
      app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
      });
    })
    .catch((err) => {
      console.warn("Error", err);
    });
} finally {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
    }
  });
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
