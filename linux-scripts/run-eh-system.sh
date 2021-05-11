# run eh system. give option number (1 or 2)

set -ex
HERE=$(dirname $(realpath $BASH_SOURCE))
cd $HERE

TARGET=""

if [[ $1 == 1 ]]; then
    TARGET=../../../../h/cg
elif [[ $1 == 2 ]]; then
    TARGET=../../../../h/3d
else
    echo "did not specify target"
    read
    exit
fi

cd ..
sudo npm run server -- --path $TARGET