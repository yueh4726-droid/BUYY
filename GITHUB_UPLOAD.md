# GitHub 上傳教學

如果你想把這個網站直接放到 GitHub，最簡單就是照下面做。

## 1. 先安裝 Git

下載：

https://git-scm.com/download/win

安裝完成後，重新開一個 PowerShell。

## 2. 到 GitHub 建立一個新 repo

例如取名：

- `phone-price-dashboard`

建立好之後，把 repo 網址複製起來，像這樣：

```text
https://github.com/你的帳號/phone-price-dashboard.git
```

## 3. 進入專案資料夾

```powershell
cd C:\Users\user\Documents\Codex\2026-04-23-new-chat-2
```

## 4. 把下面指令整段貼上

先把最後一行的 GitHub 網址改成你自己的 repo。

```powershell
git init
git branch -M main
git add .
git commit -m "Initial website upload"
git remote add origin https://github.com/你的帳號/phone-price-dashboard.git
git push -u origin main
```

## 5. 上傳完成後

你就會在 GitHub 上看到整個網站程式碼。

之後每次有改內容，只要再貼這 3 行：

```powershell
git add .
git commit -m "update website"
git push
```

## 補充

如果 `git commit` 跳出要你設定名字和信箱，就先貼這兩行：

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的Email"
```
