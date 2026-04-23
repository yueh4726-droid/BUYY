$ErrorActionPreference = "Stop"

$projectPath = "C:\Users\user\Documents\Codex\2026-04-23-new-chat-2"
$repoUrl = "https://github.com/yueh4726-droid/BUYY.git"
$gitUserName = "yueh4726-droid"
$gitUserEmail = "yueh4726@gmail.com"
$gitExe = "C:\Program Files\Git\cmd\git.exe"

if (-not (Test-Path $gitExe)) {
  throw "Git not found at C:\Program Files\Git\cmd\git.exe"
}

Set-Location $projectPath

& $gitExe config --global user.name $gitUserName
& $gitExe config --global user.email $gitUserEmail

if (-not (Test-Path ".git")) {
  & $gitExe init
  if ($LASTEXITCODE -ne 0) { throw "git init failed" }
}

& $gitExe branch -M main
if ($LASTEXITCODE -ne 0) { throw "git branch failed" }

& $gitExe add .
if ($LASTEXITCODE -ne 0) { throw "git add failed" }

& $gitExe commit -m "Initial website upload"
if ($LASTEXITCODE -ne 0) {
  Write-Host "No new commit was created. Continue to push."
}

& $gitExe remote get-url origin | Out-Null
if ($LASTEXITCODE -eq 0) {
  & $gitExe remote set-url origin $repoUrl
  if ($LASTEXITCODE -ne 0) { throw "git remote set-url failed" }
} else {
  & $gitExe remote add origin $repoUrl
  if ($LASTEXITCODE -ne 0) { throw "git remote add failed" }
}

& $gitExe push -u origin main
if ($LASTEXITCODE -ne 0) {
  throw "git push failed"
}

Write-Host ""
Write-Host "Done. GitHub upload finished."
