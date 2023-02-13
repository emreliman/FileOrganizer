const os = require('os');
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const Toastify = require('toastify-js');
const fs = require('fs')

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  invoke: (str) => ipcRenderer.invoke(str),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld('fs', {
    statSync: (str) => fs.statSync(str),
    existsSync: (str) => fs.existsSync(str),
    mkdirSync:  (str)=> fs.mkdirSync(str),
    renameSync: (str1, str2) => fs.renameSync(str1,str2),
    rmdirSync: (str) => fs.rmdirSync(str),
    readdirSync: (str) => fs.readdirSync(str),
    isDirectory: (str) => fs.statSync(str).isDirectory()
    
  });