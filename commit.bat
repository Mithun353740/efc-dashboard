@echo off
git add .
git commit -m "feat: match day countdown + fix localStorage image quota crash"
git push
del "%~f0"
