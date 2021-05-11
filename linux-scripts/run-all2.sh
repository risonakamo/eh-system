set -ex

tmux split-pane ./run-eh-system.sh
tmux next-layout
./run-nginx.sh