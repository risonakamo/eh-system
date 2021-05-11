# run all in tmuxes, part 2. give it option number (1 or 2)

set -ex
HERE=$(dirname $(realpath $BASH_SOURCE))
cd $HERE

if [[ -z $1 ]]; then
    echo "missing option number"
    read
    exit
fi

tmux split-pane "./run-eh-system.sh $1"
tmux next-layout
./run-nginx.sh $1