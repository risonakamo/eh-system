import express from "express";
import serveIndex from "serve-index";
import {join} from "path";

import {generateThumbnailsForPath,getImagesInPath2} from "./imagedata-service";

// path to image data directory, relative to this server file.
const imageDataDir:string="../../h";
const thumbnailDataDir:string="../thumbnaildata";

const fullImageDataDir:string=join(__dirname,imageDataDir);
const fullThumbnailDataDir:string=join(__dirname,thumbnailDataDir);

const app=express();

// --- static serving ---
// eh viewer page
app.use("/viewer/*",express.static(`${__dirname}/../ehviewer`));

// album explore page
app.use("/albums*",express.static(`${__dirname}/../albumexplore`));
app.use("//",(req,res)=>{
    res.redirect("/albums");
});

// web page combined build folder
app.use("/build",express.static(`${__dirname}/../build`));

// image data directory
app.use("/imagedata",express.static(fullImageDataDir));

// thumbnail data directory
app.use("/thumbnaildata",express.static(fullThumbnailDataDir));

// temporary directory browser
app.use("/imagedata",serveIndex(fullImageDataDir,{
    icons:true
}));
// --- end static serving ---

// apis
// get an album from the image data folder. also generate thumbnails if needed.
app.post("/get-album",express.text(),(req,res)=>{
    generateThumbnailsForPath(fullImageDataDir,fullThumbnailDataDir,req.body);
    res.json(getImagesInPath2(fullImageDataDir,req.body));
});

app.listen(80,()=>{
    console.log("express started");
});