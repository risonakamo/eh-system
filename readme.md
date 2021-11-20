# album shuffle server
local album server for browsing and viewing media directory (images and video), with shuffle-merged albums

## shuffle merging
the concept of the album viewer is shuffle merging. in other album applications, images/media can belong to albums, and when they are in an album they have a fixed order. Multiple albums can then be organised into directories or folders. These folders are often for organisational purpose for a user to ultimately navigate to and view a single target album. Shuffle merging allows for the viewing of any folder of albums instead of just single albums. When deciding to view a folder which has multiple albums, all albums within the folder, recursively, are merged together to form a large album consisting of all the images from all the albums within the selected folder. However, the fixed order of each individual album is retained. Thus shuffling involves the order in which the albums are presented.

# installation
```bash
npm i
npm run build
npm run build-server
```

# usage
1. edit `config/config.yml`
    - **(required)** provide path to your desired media directory
    - (optional) provide path to generated thumbnail directory. by default it is relative to the top level of this repo, so it will be in this folder

2. generate thumbnails. thumbnails need to be regenerated any time images in your image directory are changed.
```bash
npm run run-gen-thumbnails
```

3. run the server
```bash
npm run run-server
```

# windows scripts
some windows scripts are available to easily run certain tasks from windows explorer