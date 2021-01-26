cd ../nginx
nginx -c nginx.conf -s quit
start nginx -c nginx.conf

cd ..
npm run server -- --path ../../../../h/3d