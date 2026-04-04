# ClipBridge

> Instant text sharing between your Windows PC and any device with a browser — over local Wi-Fi, no internet required.

<img width="1028" height="1028" alt="ClipBridge (2)" src="https://github.com/user-attachments/assets/7d6c3622-21a2-4d82-a15b-cf27f9819c9a" />

---<img width="1037" height="1037" alt="ClipBridge (1)" src="https://github.com/user-attachments/assets/30521b08-c81e-4fb7-9f28-0ca25e20d021" />


## The Story

The idea for ClipBridge grew out of a small but persistent daily frustration. Like many people who work across a PC and a phone, I had fallen into the habit of sending text snippets to myself on WhatsApp — typing something on one device, opening WhatsApp Web on the other, copying it out, and closing the tab. It worked, but it was the kind of workaround you tolerate rather than enjoy. I was aware of Windows Phone Link as a more official solution, but every time I tried to lean on it, the setup process fought back — pairing issues, permissions, the app not behaving consistently — and it never quite felt reliable enough to trust as part of my daily flow. What I actually wanted was something invisible and immediate: paste on one device, it appears on the other, done. When I sat down with Claude and described the problem, what started as a conversation about the best architecture quickly turned into a full development session — debating tradeoffs between Bluetooth and local Wi-Fi, cloud sync and offline-first design, single executable packaging and portable folders. Each decision led to the next, and ClipBridge emerged from that back-and-forth as exactly the tool I had been missing: no accounts, no cloud, no friction.

---

## How It Works

ClipBridge runs a small server silently in the background on your Windows PC, accessible from any browser on the same network. When you open the ClipBridge URL on your phone and your PC simultaneously, both devices stay in sync in real time. Anything sent from one device appears instantly on the other.

The server starts with a single double-click and lives quietly in the Windows system tray as an amber icon. It saves your text history locally on your PC, so nothing is ever sent to the cloud.

---

## Features

- **Real-time sync** — Text sent from either device appears on the other instantly, with no refresh needed, powered by a persistent WebSocket connection
- **Persistent history** — Every entry you send is saved and visible on both devices, stored locally in a plain JSON file on your PC
- **One-tap copy** — Each history entry has a dedicated copy button that works correctly on both PC and phone browsers, including over plain HTTP connections
- **QR code launcher** — A built-in QR code displays the local URL as a scannable code — point your phone camera at it to open ClipBridge instantly
- **Expand/collapse** — Long text entries are automatically collapsed to keep the interface clean, with an expand button to reveal the full content
- **Delete and clear** — Remove individual entries or wipe the entire history across all devices simultaneously
- **System tray** — Runs silently in the Windows system tray with a right-click menu to open the app or quit
- **Smart IP detection** — Automatically detects your local network address and shows all available IPs in the tray menu, useful when a VPN is active
- **Auto firewall rule** — Registers its own Windows Firewall exception on first launch so your phone can connect without any manual configuration
- **Fully portable** — The folder can be zipped and shared with anyone; a one-time setup script handles everything on the recipient's machine

---

## Supported Devices

| Device | Requirement |
|---|---|
| Windows PC | Node.js installed, run `SETUP.bat` once |
| Android phone | Any browser — Chrome, Firefox, Samsung Internet |
| iPhone / iPad | Any browser — works fully, copy button may require manual selection in Safari |
| Any other device | Any modern browser on the same network |

---

## Requirements

- **Windows PC** — Windows 10 or later
- **Node.js** — Download and install from [nodejs.org](https://nodejs.org) choose the LTS version or Windows Installer (.msi)
- **Phone or other device** — Any browser, no install needed

---

## Setup

### First time on a new PC

**1. Install Node.js**

Go to [nodejs.org](https://nodejs.org), download the **LTS** version for Windows or Windows Installer (.msi), and run the installer. Click through the defaults — no custom options needed.

Verify it worked by opening CMD and typing:
```
node --version
```
You should see a version number like `v24.x.x`.

**2. Download ClipBridge**

Click the green **Code** button on this page → **Download ZIP**. Extract the folder somewhere permanent, such as `C:\ClipBridge\`.

**3. Run SETUP.bat**

Right-click `SETUP.bat` and choose **Run as administrator**. This installs the required dependencies. It takes about one minute.

**4. Start ClipBridge**

Double-click **Start ClipBridge.vbs**. Nothing visible will appear — that is correct. Look for the amber clipboard icon in your **system tray** (bottom-right corner of your taskbar, click the `^` arrow to reveal hidden icons).

**5. Open on your phone**

Right-click the tray icon → **Open in browser**. Note the URL shown (e.g. `http://192.168.1.5:3000`). Open that URL in any browser on your phone. Your phone must be on the **same Wi-Fi network** as your PC, or your phone can share a hotspot that your PC connects to.

You can also click **Show phone QR code** inside the app to scan the URL directly with your camera.

### Start automatically with Windows

Press `Win + R`, type `shell:startup`, press Enter. Copy a shortcut to `Start ClipBridge.vbs` into that folder. ClipBridge will now launch silently every time Windows starts.

### Every day after setup

Just double-click **Start ClipBridge.vbs** and open the URL on your phone.

---

## Usage

| Action | How |
|---|---|
| Send text from PC | Type or paste in the box, press **Ctrl + Enter** or click **Send** |
| Send text from phone | Open the URL on your phone, type or paste, tap **Send** |
| Copy an item | Click the **⊕ copy** button on any history card |
| Delete one item | Click **✕** on the card |
| Clear everything | Click **Clear all** |
| Open app in browser | Right-click the tray icon → **Open** |
| Stop ClipBridge | Right-click the tray icon → **Quit** |

---

## Troubleshooting

### Phone can't connect — works on PC but not phone

This is almost always Windows Firewall blocking the connection. ClipBridge attempts to add its own firewall rule automatically on first launch, but this requires the app to be started with administrator privileges at least once.

**Fix:**
1. Press the Windows key, type `firewall`, open **Windows Defender Firewall**
2. Click **Allow an app or feature through Windows Defender Firewall**
3. Click **Change settings**, then **Allow another app…**
4. Click **Browse…** and navigate to your ClipBridge folder, select `node.exe`
5. Click **Add**, make sure both **Private** and **Public** are checked, click **OK**

### VPN is active and phone can't connect

When a VPN is running, it assigns your PC an alternative IP address (e.g. `10.x.x.x`) that your phone cannot reach. ClipBridge will show multiple addresses in the tray menu when this happens.

**Option 1 — Use the correct IP:** Right-click the tray icon. If you see multiple **Open** entries, try the one starting with `192.168.` — that is your real local Wi-Fi address your phone can reach.

**Option 2 — Disconnect VPN:** Turn off your VPN, then quit and restart ClipBridge. The tray icon will show your regular home network IP.

### IP address changes between sessions

This is normal — your router assigns a new IP when your PC reconnects. Either check the tray icon each session, or assign a static local IP to your PC in your router's settings.

---

## Privacy

All data stays on your local network. Nothing is transmitted to any external server. History is saved as a plain text file at:
```
C:\Users\YourName\.clipbridge-history.json
```
You can back it up, inspect it in Notepad, or delete it to reset your history at any time.

---

## License

MIT — do whatever you want with this, just keep the credit.
