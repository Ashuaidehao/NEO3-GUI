// Modules to control application life and create native browser window
// import nodeManager from "./src/node-manager";

const {
    app,
    shell,
    Menu,
    BrowserWindow,
    globalShortcut,
    session,
} = require('electron') // eslint-disable-line import/no-extraneous-dependencies
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow


// adapted from https://github.com/chentsulin/electron-react-boilerplate
const installExtensions = () => {
    const installer = require('electron-devtools-installer') // eslint-disable-line import/no-extraneous-dependencies
    const extensions = ['REACT_DEVELOPER_TOOLS', 'MOBX_DEVTOOLS']

    return Promise.all(
        extensions.map(name => installer.default(installer[name])),
    ).catch(console.error)
}

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 700,
        minWidth: 1100,
        minHeight: 700,
        //resizable: false,
        webPreferences: {
            javascript: true,
            plugins: true,
            nodeIntegration: false,
            webSecurity: false,
            preload: path.join(__dirname, './preload.js')
        }
    })

    // and load the index.html of the app.
    if (process.env.NODE_ENV === "development") {
        console.log("development");
        mainWindow.loadURL(`http://localhost:3000/`);
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        //Hide toolBar
        Menu.setApplicationMenu(null)
        mainWindow.loadURL(
            url.format({
                protocol: 'file',
                slashes: true,
                pathname: path.join(__dirname, '/build/index.html'),
            }),
        )
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
    
    mainWindow.webContents.on('new-window',function(event, url){
        event.preventDefault()
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

    if (process.env.NODE_ENV === 'development') {
        installExtensions().then(() => createWindow())
    } else {
        createWindow()
    }
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.