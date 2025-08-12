Write-Host "Setting up Git repository for Yaniv mobile app..." -ForegroundColor Green

Write-Host "`nAdding all files to Git..." -ForegroundColor Yellow
git add .

Write-Host "`nCreating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Yaniv mobile app with React Native and Expo"

Write-Host "`nSetting remote origin..." -ForegroundColor Yellow
git remote add origin https://github.com/Shai-Shargal/Yaniv.git

Write-Host "`nPushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host "`nSetup complete! Your Yaniv mobile app is now connected to GitHub." -ForegroundColor Green
Write-Host "Repository: https://github.com/Shai-Shargal/Yaniv.git" -ForegroundColor Cyan
Write-Host "`nPress any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
