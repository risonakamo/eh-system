# run all in tmuxes. give option number (1 or 2)

set -ex

if [[ -z $1 ]]; then
    echo "missing option number"
    exit
fi

sudo tmux new "./run-all2.sh $1"