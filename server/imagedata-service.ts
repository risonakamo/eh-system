import fs from "fs-extra";
import _ from "lodash";
import {join} from "path";
import imageThumbnail from "image-thumbnail";

// given an album path within imagedata, return the urls for that path.
export function getImagesInPath(imageDataPath:string,targetPath:string):string[]
{
    var imgs:string[];

    try
    {
        imgs=fs.readdirSync(join(imageDataPath,targetPath));
    }

    catch (err)
    {
        return [];
    }

    return _.map(imgs,(x:string)=>{
        return `/imagedata/${targetPath}/${x}`;
    });
}

// generate thumbnails for the target path into the thumbnail data folder
export async function generateThumbnailsForPath(imageDataPath:string,thumbnailDataPath:string,targetPath:string):Promise<void>
{
    var imgs:string[];
    var existingThumbnails:string[];
    var thumbnailResult:string[]=[];

    // create the mirrored thumbnail path in the thumbnail data folder
    fs.ensureDirSync(join(thumbnailDataPath,targetPath));

    // attempt to retrive target images and possibly existing thumbnail
    try
    {
        imgs=fs.readdirSync(join(imageDataPath,targetPath));
        existingThumbnails=fs.readdirSync(join(thumbnailDataPath,targetPath));
    }

    catch (err)
    {
        return;
    }

    // if thumbnails already generated, dont do it again
    if (imgs.length==existingThumbnails.length)
    {
        return;
    }

    // convert image paths and soon to be created thumbnail result paths
    var imgs=_.map(imgs,(x:string)=>{
        thumbnailResult.push(join(thumbnailDataPath,targetPath,x));
        return join(imageDataPath,targetPath,x);
    });

    // generate thumbnails for each image asynchronously
    imgs.forEach((x:string,i:number)=>{
        imageThumbnail(x,{
            width:180,
            height:180,
            responseType:"buffer",
            fit:"cover"
        } as any).then((thumbnail:Buffer)=>{
            fs.writeFile(thumbnailResult[i],thumbnail,()=>{});
        });
    });
}