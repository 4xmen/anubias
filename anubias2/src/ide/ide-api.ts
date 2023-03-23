import { lstat } from 'node:fs/promises';
import { cwd } from 'node:process';
import { ipcRenderer } from 'electron';
import router from "./router";


ipcRenderer.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})
ipcRenderer.on('hello-world', (_event, ...args) => {
  console.log('Hello world:', ...args)
});
ipcRenderer.on('redirect', (_event, ...args) => {
  console.log('redirect:', ...args);
  router.push(args[0]);
});


lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats)
}).catch(err => {
  console.error(err)
});

// ipcRenderer.send('close',true);