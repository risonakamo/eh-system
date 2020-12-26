import express from "express";
import serveIndex from "serve-index";
import {join} from "path";
import meow from "meow";
import chalk from "chalk";

import {generateThumbnailsForPath,getImagesInPath2Flat} from "./imagedata-service";
import {getAlbumInfo} from "./album-service";

function main()
{
    const args:ServerArgs=getArgs();

    // path to image data directory, relative to this server file.
    const imageDataDir:string=args.flags.path;
    const thumbnailDataDir:string="../../thumbnaildata";

    const fullImageDataDir:string=join(__dirname,imageDataDir);
    const fullThumbnailDataDir:string=join(__dirname,thumbnailDataDir);

    const app=express();

    // --- static serving ---
    // eh viewer page
    app.use("/viewer/*",express.static(`${__dirname}/../../ehviewer`));

    // album explore page
    app.use("/albums*",express.static(`${__dirname}/../../albumexplore`));
    app.use("//",(req,res)=>{
        res.redirect("/albums");
    });

    // web page combined build folder
    app.use("/build",express.static(`${__dirname}/../../build`));

    // fonts folder
    app.use("/assets/fonts",express.static(`${__dirname}/../../fonts`));

    // img assets folder
    app.use("/assets/imgs",express.static(`${__dirname}/../../imgs`));

    // image data directory
    app.use("/imagedata",express.static(fullImageDataDir));

    // thumbnail data directory
    app.use("/thumbnaildata",express.static(fullThumbnailDataDir));

    // temporary directory browser
    app.use("/imagedata",serveIndex(fullImageDataDir,{
        icons:true
    }));
    // --- end static serving ---

    // --- apis ---
    // get an album from the image data folder. also generate thumbnails if needed.
    app.post("/get-album",express.text(),(req,res)=>{
        console.log("get album:",req.body);
        generateThumbnailsForPath(fullImageDataDir,fullThumbnailDataDir,req.body);
        res.json(getImagesInPath2Flat(fullImageDataDir,req.body));
    });

    // given a target album path, retrieve album information for that path.
    app.post("/get-album-info",express.text(),(req,res)=>{
        console.log("album info:",req.body || "/");
        generateThumbnailsForPath(fullImageDataDir,fullThumbnailDataDir,req.body);
        res.json(getAlbumInfo(fullImageDataDir,req.body));
    });
    // --- end apis ---

    app.listen(80,()=>{
        console.log(chalk.green("EH-SYSTEM started"));
    });
}

function getArgs():ServerArgs
{
    return meow({
        flags:{
            // path to image data dir
            path:{
                type:"string",
                default:"../../../../h/cg"
            }
        },
        help:`--path: specify path to target image data directory, relative to the eh-system build folder`
    });
}

main();