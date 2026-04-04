' ClipBridge Launcher
' Double-click this file to start ClipBridge silently in the background.

Set fso      = CreateObject("Scripting.FileSystemObject")
Set WshShell = CreateObject("WScript.Shell")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
nodeExe   = scriptDir & "\node.exe"
serverJs  = scriptDir & "\server.js"

' Check setup has been run
If Not fso.FileExists(nodeExe) Then
    MsgBox "node.exe not found in the ClipBridge folder." & vbCrLf & vbCrLf & _
           "Please run SETUP.bat first.", 16, "ClipBridge"
    WScript.Quit
End If

If Not fso.FileExists(serverJs) Then
    MsgBox "server.js not found. Make sure all ClipBridge files are together.", 16, "ClipBridge"
    WScript.Quit
End If

' Launch node server.js silently
WshShell.CurrentDirectory = scriptDir
WshShell.Run """" & nodeExe & """ """ & serverJs & """", 0, False
