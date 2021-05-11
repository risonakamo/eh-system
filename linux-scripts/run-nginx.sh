set -ex
HERE=$(dirname $(realpath $BASH_SOURCE))
cd $HERE

cd ../nginx
sudo nginx -p $(pwd) -c nginx.conf