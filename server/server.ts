import express from "express";
import {getImagesInPath} from "./imagedata-service";

const app=express();

app.use("/viewer/*",express.static(`${__dirname}/../ehviewer`));
app.use("/build",express.static(`${__dirname}/../build`));

app.use("/imagedata",express.static(`${__dirname}/../imagedata`));

app.post("/get-album",express.text(),(req,res)=>{
    res.json(getImagesInPath(req.body));
});

app.listen(80,()=>{
    console.log("express started");
});