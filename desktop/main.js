// Pintar — wersja .exe (Electron)
// Okno gry + przekaźnik WebSocket na porcie 7777 do gry przez Radmin VPN:
// host łączy się z własnym przekaźnikiem (127.0.0.1), drugi gracz z IP hosta z Radmina.
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = 7777;
let relay = null;

function startRelay() {
  try {
    relay = new WebSocketServer({ host: '0.0.0.0', port: PORT });
    relay.on('connection', (ws) => {
      ws.on('message', (data) => {
        const msg = data.toString();
        for (const c of relay.clients) if (c !== ws && c.readyState === 1) c.send(msg);
      });
    });
    relay.on('error', (e) => console.error('Przekaźnik:', e.message));
  } catch (e) {
    console.error('Nie udało się uruchomić przekaźnika:', e.message);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    backgroundColor: '#1a140e',
    title: 'Pintar',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
      backgroundThrottling: false
    }
  });
  Menu.setApplicationMenu(null);
  win.maximize();
  win.setFullScreen(true);
  win.webContents.on('before-input-event', (e, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
  });
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
}

app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.whenReady().then(() => { startRelay(); createWindow(); });
app.on('window-all-closed', () => { if (relay) relay.close(); app.quit(); });
