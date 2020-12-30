# album shuffle server (eh-system)
local album server for browsing and viewing folders of images, with shuffle merging.

# installation
```bash
npm i
npm run build
```
after building, can use `runserver.bat` to launch the server. modify the path in `runserver.bat` to point to your image path.
  - path must be relative to node-build/server/server.js

# npm commands
## usage
- `build`: build all components for production use
- `server-run`: run the server
- `mng-thumbnails`: use thumbnail manager cli

## dev
- `watch`: watch frontend
- `build-dev`: build frontend for dev
- `server-build`: build the server
- `server`: build and run the server
- `mng-thumbnails-dev`: build and run mng thumbnails