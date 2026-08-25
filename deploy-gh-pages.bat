@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"
cd /d "d:\ReactApps2Git\CRM\demo"
call npm run build
if not exist "dist\index.html" (
  echo BUILD FAILED
  exit /b 1
)
cd /d "d:\ReactApps2Git\CRM\demo\dist"
if exist .git rmdir /s /q .git
%GIT% init -b gh-pages
%GIT% add -A
%GIT% status --short
%GIT% -c user.name="Razel Tech" -c user.email="razeltech.in@gmail.com" commit --no-verify -m "Deploy demonstration site to GitHub Pages."
%GIT% remote add origin https://github.com/r2dapps/nph-yaba-demo.git
%GIT% push -f origin gh-pages
%GIT% log -1 --format=full
