cd ../nginx
nginx -c nginx.conf -s quit
start nginx -c nginx2.conf

cd ..
npm run server -- --path ../../../../h/3d