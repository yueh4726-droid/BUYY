$ErrorActionPreference = "Stop"

$projectPath = "C:\Users\user\Documents\Codex\2026-04-23-new-chat-2"
$repoUrl = "https://github.com/yueh4726-droid/BUYY.git"
$gitUserName = "yueh4726-droid"
$gitUserEmail = "yueh4726@gmail.com"

Set-Location $projectPath

git --version | Out-Null

git config --global user.name $gitUserName
git config --global user.email $gitUserEmail

if (-not (Test-Path ".git")) {
  git init
}

git branch -M main
git add .

git commit -m "Initial website upload"
if ($LASTEXITCODE -ne 0) {
  Write-Host "No new commit was created. Continue to push."
}

$hasOrigin = $false
git remote get-url origin | Out-Null
if ($LASTEXITCODE -eq 0) {
  $hasOrigin = $true
}

if ($hasOrigin) {
  git remote set-url origin $repoUrl
} else {
  git remote add origin $repoUrl
}

git push -u origin main

Write-Host ""
Write-Host "Done. GitHub upload finished."
