@echo off
echo Setting up Git repository for Yaniv mobile app...

echo.
echo Adding all files to Git...
git add .

echo.
echo Creating initial commit...
git commit -m "Initial commit: Yaniv mobile app with React Native and Expo"

echo.
echo Setting remote origin...
git remote add origin https://github.com/Shai-Shargal/Yaniv.git

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo Setup complete! Your Yaniv mobile app is now connected to GitHub.
echo Repository: https://github.com/Shai-Shargal/Yaniv.git
pause
