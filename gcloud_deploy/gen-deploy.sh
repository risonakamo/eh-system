# generate files for gcloud app deploy. will create/use folder named "deployment"

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
    gcloud_deploy/app.yaml \
    package.json \
    package-lock.json \
\
    $deployment_dir

cp gcloud_deploy/cloudconfig.yml $deployment_dir/config/config.yml

cp -r --parents \
    web/pages/**/index.html \
    web/assets \
    $deployment_dir

echo "deployment generated"