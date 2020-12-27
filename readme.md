# album shuffle server (eh-system)
a local album server for browsing and viewing folders of images, with shuffle merging.

# installation
## initial configuration
- in `server/server.ts`, the path to the image directory (directory containing images you wish to host), must be set.
- the path to the thumbnails directory (where generated thumbnails will be stored) must be set.

## building
```bash
npm i
npm run build
npm run server-build
```

after building, can use `runserver.bat` to launch the server.

# npm commands
## frontend
- `watch`: (dev) watch
- `build-dev`: (dev) build for dev
- `build`: build for production

## server
- `server-run`: run the server
- `server-build`: (dev) build the server
- `server`: (dev) build and run the server

## thumbnail management
- `mng-thumbnails`: run mng thumbnails program
- `mng-thumbnails-dev`: (dev) build and run mng thumbnails