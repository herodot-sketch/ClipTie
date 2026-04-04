# ClipBridge

Sync text between your Windows PC and Android phone over local Wi-Fi.
No internet required. No accounts. No installs on Android — just a browser.

---

## First time on a new PC

1. install Node.js first from nodejs.org

2. Right-click And run administrator **SETUP.bat** 
   - Copies node.exe into this folder (~80MB, one-time only)
   - Installs dependencies (~1 minute)

3. Double-click **Start ClipBridge.vbs**
   - Nothing visible happens — that's correct
   - Look for the amber icon in your system tray (bottom-right, click the ^ arrow)

4. Right-click the tray icon → **Open in browser**
   - Note the URL shown (e.g. http://192.168.1.5:3000)
   - Open that URL on your phone's browser by typing it in the browser or scanning the QR code On the web page (must be on same Wi-Fi or hotspot)

---

## Every day after that

Just double-click **Start ClipBridge.vbs** and open the URL on your phone.

To start automatically with Windows:
- Press Win+R → type shell:startup → Enter
- Copy a shortcut to "Start ClipBridge.vbs" into that folder

---

## Sharing with someone else

Send them this entire folder (zip it up).
They run SETUP.bat once, then Start ClipBridge.vbs forever after.
Node.js does NOT need to be installed — it's included in the folder.

---

## Troubleshooting two issues that I have encountered and fixed:

1- Windows Firewall

If it works on the PC, but it won’t open on your phone, The problem is almost certainly Windows Firewall blocking the node.exe.
Windows Firewall sees it as an unknown program and blocks incoming connections from your phone.

Fix — add a firewall exception:

Press the Windows key, type firewall, open Windows Defender Firewall
Click Allow an app or feature through Windows Defender Firewall on the left
Click Change settings.
Click Allow another app… (bottom right)
Click Browse… and navigate to your clipbridge folder
Select node.exe → click Open
Click Add, make sure both Private and Public are checked
Click OK

Then try opening on your phone again. It should connect immediately.

2- VPN connection

When using this tool during a VPN connection, The VPN is assigning your PC to a different address (e.g. 10.3.0.3), which is a private VPN tunnel address — your phone can't reach it because your phone isn't inside that VPN.

Fix — You have Two options:

Option 1 — Disconnect VPN while using ClipBridge
The simplest fix. Turn off VPN, restart ClipBridge (quit it from the Windows system tray And then Double-click **Start ClipBridge.vbs**), and use the new IP that appears. Your home Wi-Fi IP will be something like (e.g. 192.168.x.x) which your phone can reach normally.

Option 2 — Find your real local IP while VPN is on
Some VPNs allow local network traffic through. Run ipconfig in CMD and look for an adapter named something like Wi-Fi or Ethernet (not the VPN adapter).specifically any IPv4 Address lines If it has an (e.g. 192.168.x.x) address, try that IP on your phone instead of (e.g. 10.3.0.3)

---

## I made Claude rewrite the server.js in the clipbridge folder. Here's exactly what was fixed:

Firewall — now automatic. 
On every startup, the server silently runs a Windows command (netsh) to register its own firewall exception. If the rule already exists it skips it, if it fails due to permissions it carries on quietly. Most users will never need to touch the firewall manually again.

VPN / IP — now smart and transparent. 
The IP detection was completely rewritten. It now collects every available network address and sorts them so that local Wi-Fi addresses (192.168.x.x) always rank above VPN tunnel addresses (10.x.x.x). If you have multiple addresses — which happens when VPN is active — the tray menu shows a separate Open entry for each one, labelled with its full URL, so you can instantly try the right one without running ipconfig or reading a guide.

The README troubleshooting section I included serves as good documentation of why these issues happen, but users hopefully should no longer need to follow those steps manually.
