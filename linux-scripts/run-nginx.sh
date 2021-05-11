# run eh system nginx. give option number (1 or 2)

set -ex
HERE=$(dirname $(realpath $BASH_SOURCE))
cd $HERE

TARGET=""

if [[ $1 == 1 ]]; then
    TARGET=nginx.conf
elif [[ $1 == 2 ]]; then
    TARGET=./nginx2.conf
else
    echo "did not specify target"
    read
    exit
fi

cd ../nginx
sudo nginx -p $(pwd) -c $TARGET