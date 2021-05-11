set -ex
HERE=$(dirname $(realpath $BASH_SOURCE))
cd $HERE

cd ..
sudo npm run server -- --path ../../../../h/cg