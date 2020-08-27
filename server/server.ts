import express from "express";
import serveIndex from "serve-index";
import {join} from "path";

import {getImagesInPath,generateThumbnailsForPath} from "./imagedata-service";

// path to image data directory, relative to this server file.
const imageDataDir:string="../../h";
const thumbnailDataDir:string="../thumbnaildata";

const fullImageDataDir:string=join(__dirname,imageDataDir);
const fullThumbnailDataDir:string=join(__dirname,thumbnailDataDir);

const app=express();

// eh viewer page
app.use("/viewer/*",express.static(`${__dirname}/../ehviewer`));

// web page combined build folder
app.use("/build",express.static(`${__dirname}/../build`));

// image data directory
app.use("/imagedata",express.static(fullImageDataDir));
// temporary directory browser
app.use("/imagedata",serveIndex(fullImageDataDir,{
    icons:true
}));

// apis
// get an album from the image data folder. also generate thumbnails if needed.
app.post("/get-album",express.text(),(req,res)=>{
    generateThumbnailsForPath(fullImageDataDir,fullThumbnailDataDir,req.body);
    res.json(getImagesInPath(fullImageDataDir,req.body));
});

app.listen(80,()=>{
    console.log("express started");
});