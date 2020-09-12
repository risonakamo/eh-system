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
npm run server
```

after building, can use `runserver.bat` to launch the server.