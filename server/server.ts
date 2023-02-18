import express from "express";
import serveIndex from "serve-index";
import chalk from "chalk";
import _ from "lodash";
import {Bucket,Storage} from "@google-cloud/storage";

import {getImagesInPath2Flat} from "./lib/imagedata-service";
import {getAlbumInfo} from "./lib/album-service";
import {getServerConfig} from "./lib/server-config";
import {getCloudImageDataUrls} from "./lib/googlecloud/cloud-imagedata2";
import {getCloudAlbumInfo} from "./lib/googlecloud/cloud-albuminfo2";
import {getServerArgs} from "./lib/cli";

function main()
{
    const serverArgs:ServerCliArgs=getServerArgs();

    const serverConfig:ServerConfig=getServerConfig(serverArgs.configLocation);

    const fullImageDataDir:string=serverConfig.imagedir;
    const fullThumbnailDataDir:string=serverConfig.thumbnaildir;

    const app=express();

    var mainCloudBucket:Bucket|undefined;
    if (serverConfig.google_cloud_config.enabled)
    {
        const storage=new Storage({
            keyFilename:`${__dirname}/../config/cloudkey.json`
        });

        mainCloudBucket=storage.bucket(serverConfig.google_cloud_config.mainimage_bucket);
    }

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
    app.post("/get-album",express.text(),
    async (req:express.Request<string>,res:express.Response<AlbumResponse>)=>{
        console.log("get album:",req.body);

        if (!serverConfig.google_cloud_config.enabled)
        {
            res.json({
                mode:"local",
                urls:getImagesInPath2Flat(fullImageDataDir,req.body)
            });
        }

        else if (mainCloudBucket)
        {
            const response:AlbumResponseCloud={
                mode:"cloud",
                urls:await getCloudImageDataUrls(req.body,mainCloudBucket),
                cloudInfo:{
                    mainUrl:serverConfig.google_cloud_config.mainimage_bucket,
                    thumbnailUrl:serverConfig.google_cloud_config.thumbnail_bucket
                }
            };

            res.json(response);
        }
    });

    // given a target album path, retrieve album information for that path.
    app.post("/get-album-info",express.text(),
    async (req:express.Request<string>,res:express.Response<AlbumInfo[]>)=>{
        console.log("album info:",req.body || "/");

        if (!serverConfig.google_cloud_config.enabled)
        {
            res.json(getAlbumInfo(fullImageDataDir,req.body));
        }

        else if (mainCloudBucket)
        {
            res.json(await getCloudAlbumInfo(req.body,mainCloudBucket));
        }
    });
    // --- end apis ---

    app.listen(serverConfig.port,()=>{
        console.log(chalk.green("EH-SYSTEM started"));
        console.log("config:",chalk.yellow(serverArgs.configLocation));

        if (!serverConfig.google_cloud_config.enabled)
        {
            console.log("image dir:",chalk.yellow(fullImageDataDir));
            console.log("thumbnail dir:",chalk.yellow(fullThumbnailDataDir));
        }

        else
        {
            console.log("cloud img dir:",chalk.yellow(serverConfig.google_cloud_config.mainimage_bucket));
        }
    });
}

main();