// Udostępnia grze informację, że działa jako .exe, oraz adresy IP komputera (Radmin VPN: 26.x.x.x)
const { contextBridge } = require('electron');
const os = require('os');
const ips = [];
for (const list of Object.values(os.networkInterfaces())) for (const a of list || []) if (a.family === 'IPv4' && !a.internal) ips.push(a.address);
contextBridge.exposeInMainWorld('coopDesktop', { port: 7777, ips });
