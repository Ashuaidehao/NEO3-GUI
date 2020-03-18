let NodeManager = require('./node-manager');
global.electron = require('electron');
window.ipcRenderer = require('electron').ipcRenderer;
window.remote = require('electron').remote;
window.nodeManager = new NodeManager();