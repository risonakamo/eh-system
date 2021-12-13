# generate files for gcloud app deploy

set -ex
HERE=$(dirname $(realpath $BASH_SOURCE))
cd $HERE

deployment_dir=$HERE/deployment
mkdir -p $deployment_dir

cd ..
npm run build
npm run build-server

cp -r \
    build \
    server-build \
    config \
    app.yaml \
    package.json \
    package-lock.json \
\
    $deployment_dir