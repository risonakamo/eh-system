import express from "express";
import {getImagesInPath} from "./imagedata-service";
import serveIndex from "serve-index";
import {join} from "path";

// path to image data directory, relative to this server file.
const imageDataDir:string="../../h";

const app=express();

// eh viewer page
app.use("/viewer/*",express.static(`${__dirname}/../ehviewer`));

// web page combined build folder
app.use("/build",express.static(`${__dirname}/../build`));

// image data directory
var fullImageDataDir:string=join(__dirname,imageDataDir);
app.use("/imagedata",express.static(fullImageDataDir));
// temporary directory browser
app.use("/imagedata",serveIndex(fullImageDataDir,{
    icons:true
}));

// apis
app.post("/get-album",express.text(),(req,res)=>{
    res.json(getImagesInPath(fullImageDataDir,req.body));
});

app.listen(80,()=>{
    console.log("express started");
});