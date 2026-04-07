'use strict';

const express    = require('express');
const { WebSocketServer, OPEN } = require('ws');
const http       = require('http');
const fs         = require('fs');
const path       = require('path');
const os         = require('os');
const { exec, execSync } = require('child_process');

// ─── Icon ─────────────────────────────────────────────────────────────────────
const ICON_B64 = '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';

function writeIcon() {
  const iconPath = path.join(os.tmpdir(), 'cliptie.ico');
  if (!fs.existsSync(iconPath))
    fs.writeFileSync(iconPath, Buffer.from(ICON_B64, 'base64'));
  return iconPath;
}

// ─── Paths ────────────────────────────────────────────────────────────────────
const isPkg     = typeof process.pkg !== 'undefined';
const publicDir = isPkg ? path.join(path.dirname(process.execPath), 'public')
                        : path.join(__dirname, 'public');
const HISTORY_FILE = path.join(os.homedir(), '.cliptie-history.json');

// ─── History ──────────────────────────────────────────────────────────────────
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE))
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (_) {}
  return [];
}

function saveHistory(h) {
  try { fs.writeFileSync(HISTORY_FILE, JSON.stringify(h)); } catch (_) {}
}

// ─── Network helpers ──────────────────────────────────────────────────────────
function getAllIPs() {
  const results = [];
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal)
        results.push(iface.address);
    }
  }
  results.sort((a, b) => {
    const score = ip => {
      if (ip.startsWith('192.168.')) return 0;
      if (ip.startsWith('172.'))     return 1;
      if (ip.startsWith('10.'))      return 2;
      return 3;
    };
    return score(a) - score(b);
  });
  return results.length ? results : ['127.0.0.1'];
}

// ─── Firewall ─────────────────────────────────────────────────────────────────
function ensureFirewallRule() {
  if (process.platform !== 'win32') return;
  const nodePath = process.execPath;
  const ruleName = 'ClipTie';
  try {
    const check = execSync(
      'netsh advfirewall firewall show rule name="' + ruleName + '"',
      { stdio: 'pipe' }
    ).toString();
    if (check.includes(ruleName)) return;
  } catch (_) {}
  try {
    execSync(
      'netsh advfirewall firewall add rule' +
      ' name="' + ruleName + '"' +
      ' dir=in action=allow enable=yes' +
      ' program="' + nodePath + '"' +
      ' profile=private,public',
      { stdio: 'pipe' }
    );
  } catch (_) {}
}

// ─── State ────────────────────────────────────────────────────────────────────
let history = loadHistory();
const clients = new Set();
let trayRef   = null;   // set once tray is created
let currentIPs = [];

// ─── Express + WS server ──────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server });

app.use(express.static(publicDir));

// REST endpoint so the browser can always ask for the latest IPs
app.get('/api/ips', (_, res) => {
  res.json({ ips: getAllIPs(), port: PORT });
});

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'history', data: history }));
  // Send current IPs immediately on connect so QR code is always accurate
  ws.send(JSON.stringify({ type: 'network', ips: getAllIPs(), port: PORT }));

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      if (msg.type === 'send' && msg.text && msg.text.trim()) {
        const entry = { id: Date.now(), text: msg.text.trim(), ts: new Date().toISOString() };
        history.unshift(entry);
        if (history.length > 200) history = history.slice(0, 200);
        saveHistory(history);
        broadcast({ type: 'new', data: entry });
      } else if (msg.type === 'delete') {
        history = history.filter(e => e.id !== msg.id);
        saveHistory(history);
        broadcast({ type: 'deleted', id: msg.id });
      } else if (msg.type === 'clear') {
        history = [];
        saveHistory(history);
        broadcast({ type: 'cleared' });
      }
    } catch (_) {}
  });

  ws.on('close', () => clients.delete(ws));
});

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const ws of clients)
    if (ws.readyState === OPEN) ws.send(msg);
}

// ─── Network change watcher ───────────────────────────────────────────────────
// Polls every 4 seconds. When IPs change, updates the tray tooltip and
// broadcasts the new addresses to all connected browser clients.
function watchNetwork() {
  setInterval(() => {
    const newIPs = getAllIPs();
    const changed = newIPs.join(',') !== currentIPs.join(',');
    if (!changed) return;

    currentIPs = newIPs;
    console.log('Network changed. New IPs: ' + newIPs.join(', '));

    // Tell all connected browsers about the new network
    broadcast({ type: 'network', ips: newIPs, port: PORT });

    // Update tray tooltip (best-effort — systray2 may not reflect immediately)
    if (trayRef) {
      try {
        const primary = newIPs[0];
        trayRef.menu.tooltip = 'ClipTie — http://' + primary + ':' + PORT;
      } catch (_) {}
    }
  }, 4000);
}

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  ensureFirewallRule();
  currentIPs = getAllIPs();
  const primary = currentIPs[0];
  const url = 'http://' + primary + ':' + PORT;
  console.log('ClipTie running at ' + url);
  watchNetwork();
  startTray(currentIPs);
});

// ─── System tray ──────────────────────────────────────────────────────────────
function startTray(ips) {
  let SysTray;
  try { SysTray = require('systray2').default; } catch (_) { return; }

  const iconPath = writeIcon();
  const primary  = ips[0];
  const primaryUrl = 'http://' + primary + ':' + PORT;

  const ipItems = ips.map(ip => {
    const url = 'http://' + ip + ':' + PORT;
    const label = ips.length > 1 ? '⊕  Open — ' + url : '⊕  Open in browser';
    return { title: label, tooltip: url, checked: false, enabled: true };
  });

  const tray = new SysTray({
    menu: {
      icon:    iconPath,
      title:   '',
      tooltip: 'ClipTie — ' + primaryUrl,
      items: [
        { title: '⬡  ClipTie', tooltip: '', checked: false, enabled: false },
        SysTray.separator,
        ...ipItems,
        SysTray.separator,
        { title: '⊘  Quit', tooltip: '', checked: false, enabled: true }
      ]
    },
    debug:   false,
    copyDir: true
  });

  trayRef = tray;

  const firstIpId = 2;
  const lastIpId  = 2 + ips.length - 1;
  const quitId    = lastIpId + 2;

  tray.onClick((action) => {
    const id = action.seq_id;
    if (id >= firstIpId && id <= lastIpId) {
      const ip  = currentIPs[id - firstIpId] || currentIPs[0];
      exec('start http://' + ip + ':' + PORT);
    } else if (id === quitId) {
      tray.kill();
      process.exit(0);
    }
  });
}
