import express from "express";
import serveIndex from "serve-index";
import chalk from "chalk";

import {getImagesInPath2Flat} from "./lib/imagedata-service";
import {getAlbumInfo} from "./lib/album-service";
import {getServerConfig} from "./lib/server-config";

function main()
{
    const serverConfig:ServerConfig=getServerConfig();

    const fullImageDataDir:string=serverConfig.imagedir;
    const fullThumbnailDataDir:string=serverConfig.thumbnaildir;

    const app=express();

    // --- static serving ---
    if (serverConfig.static_serve)
    {
        // eh viewer page
        app.use("/viewer/*",express.static(`${__dirname}/../web/pages/ehviewer`));

        // album explore page
        app.use("/albums*",express.static(`${__dirname}/../web/pages/albumexplore`));
        app.use("//",(req,res)=>{
            res.redirect("/albums");
        });

        // web page combined build folder
        app.use("/build",express.static(`${__dirname}/../build`));

        // fonts folder
        app.use("/assets/fonts",express.static(`${__dirname}/../web/assets/fonts`));

        // img assets folder
        app.use("/assets/imgs",express.static(`${__dirname}/../web/assets/imgs`));

        // image data directory
        app.use("/imagedata",express.static(fullImageDataDir));

        // thumbnail data directory
        app.use("/thumbnaildata",express.static(fullThumbnailDataDir));

        // temporary directory browser
        app.use("/imagedata",serveIndex(fullImageDataDir,{
            icons:true
        }));
    }
    // --- end static serving ---


    // --- apis ---
    // get an album from the image data folder. also generate thumbnails if needed.
    app.post("/get-album",express.text(),(req,res)=>{
        console.log("get album:",req.body);

        res.json(getImagesInPath2Flat(fullImageDataDir,req.body));
    });

    // given a target album path, retrieve album information for that path.
    app.post("/get-album-info",express.text(),(req,res)=>{
        console.log("album info:",req.body || "/");

        res.json(getAlbumInfo(fullImageDataDir,req.body));
    });
    // --- end apis ---

    app.listen(serverConfig.port,()=>{
        console.log(chalk.green("EH-SYSTEM started"));
        console.log("image dir:",chalk.yellow(fullImageDataDir));
        console.log("thumbnail dir:",chalk.yellow(fullThumbnailDataDir));
    });
}

main();