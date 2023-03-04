@REM run thumbnail generation

cd %~dp0
cd ..
call npm run run-gen-thumbnails -- --config config/config2.yml
pause