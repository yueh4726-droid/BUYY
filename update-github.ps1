$ErrorActionPreference = "Stop"

$projectPath = "C:\Users\user\Documents\Codex\2026-04-23-new-chat-2"
$gitExe = "C:\Program Files\Git\cmd\git.exe"
$commitMessage = "update site"

if (-not (Test-Path $gitExe)) {
  throw "Git not found at C:\Program Files\Git\cmd\git.exe"
}

Set-Location $projectPath

& $gitExe add .
if ($LASTEXITCODE -ne 0) {
  throw "git add failed"
}

& $gitExe commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
  Write-Host "No new commit was created. Trying push anyway."
}

& $gitExe push
if ($LASTEXITCODE -ne 0) {
  throw "git push failed"
}

Write-Host ""
Write-Host "Done. GitHub update finished."
