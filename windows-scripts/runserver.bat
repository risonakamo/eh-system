cd ../nginx
taskkill /F /im nginx.exe
start nginx -c nginx.conf

cd ..
npm run server -- --path ../../../../h/cg