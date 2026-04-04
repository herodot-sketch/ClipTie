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
const isPkg    = typeof process.pkg !== 'undefined';
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
// Returns all non-internal IPv4 addresses, sorted so local LAN addresses
// (192.168.x.x and 172.16-31.x.x) come before VPN-style addresses (10.x.x.x).
function getAllIPs() {
  const results = [];
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        results.push(iface.address);
      }
    }
  }
  // Sort: prefer 192.168.x.x and 172.x.x.x over 10.x.x.x (common VPN range)
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
// Silently adds a Windows Firewall inbound rule for node.exe on first run.
// If it fails (e.g. not admin), ClipTie still works — user sees the README fix.
function ensureFirewallRule() {
  if (process.platform !== 'win32') return;
  const nodePath = process.execPath;
  const ruleName = 'ClipTie';
  try {
    // Check if rule already exists
    const check = execSync(
      'netsh advfirewall firewall show rule name="' + ruleName + '"',
      { stdio: 'pipe' }
    ).toString();
    if (check.includes(ruleName)) return; // already set
  } catch (_) {}
  // Add the rule silently
  try {
    execSync(
      'netsh advfirewall firewall add rule' +
      ' name="' + ruleName + '"' +
      ' dir=in action=allow enable=yes' +
      ' program="' + nodePath + '"' +
      ' profile=private,public',
      { stdio: 'pipe' }
    );
  } catch (_) {
    // Silently ignore — user may not be running as admin
  }
}

// ─── State ────────────────────────────────────────────────────────────────────
let history = loadHistory();
const clients = new Set();

// ─── Express + WS server ──────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server });

app.use(express.static(publicDir));

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'history', data: history }));

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

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  ensureFirewallRule();
  const ips  = getAllIPs();
  const primary = ips[0];
  const url  = 'http://' + primary + ':' + PORT;
  console.log('ClipTie running at ' + url);
  if (ips.length > 1)
    console.log('Other addresses: ' + ips.slice(1).map(ip => 'http://' + ip + ':' + PORT).join(', '));
  startTray(ips, url);
});

// ─── System tray ──────────────────────────────────────────────────────────────
function startTray(ips, primaryUrl) {
  let SysTray;
  try { SysTray = require('systray2').default; } catch (_) { return; }

  const iconPath = writeIcon();

  // Build tray items — one "Open" entry per IP address
  const ipItems = ips.map((ip, i) => {
    const url = 'http://' + ip + ':' + PORT;
    const label = ips.length > 1
      ? '⊕  Open — ' + url
      : '⊕  Open in browser';
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

  // seq_id 0 = header, 1 = separator, 2..N = IP items, N+1 = separator, N+2 = Quit
  const firstIpId  = 2;
  const lastIpId   = 2 + ips.length - 1;
  const quitId     = lastIpId + 2; // skip the second separator

  tray.onClick((action) => {
    const id = action.seq_id;
    if (id >= firstIpId && id <= lastIpId) {
      const ip  = ips[id - firstIpId];
      const url = 'http://' + ip + ':' + PORT;
      exec('start ' + url);
    } else if (id === quitId) {
      tray.kill();
      process.exit(0);
    }
  });
}
