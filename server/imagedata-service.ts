import fs from "fs-extra";
import _ from "lodash";
import {join,posix} from "path";
import normalize from "normalize-path";
import imageThumbnail from "image-thumbnail";

// return image urls at target path.
export function getImagesInPath2Flat(imageDataPath:string,targetPath:string):string[]
{
    return _.flatten(getImagesInPath2(imageDataPath,targetPath));
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

    // split out all directories
    var dirs:string[]=[];
    imgs=_.filter(imgs,(x:string)=>{
        if (fs.statSync(join(imageDataPath,targetPath,x)).isDirectory())
        {
            dirs.push(x);
            return false;
        }

        return true;
    });

    // call thumbnail generate on all subdirs
    dirs.forEach((x:string)=>{
        generateThumbnailsForPath(imageDataPath,thumbnailDataPath,posix.join(targetPath,x));
    });

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

// given the image data path, and a target path, get the image urls for each lowest level
// album at the target path.
function getImagesInPath2(imageDataPath:string,targetPath:string):string[][]
{
    var targetItemNames:string[]=[];

    try
    {
        targetItemNames=fs.readdirSync(join(imageDataPath,targetPath));
    }

    catch (err)
    {
        return [];
    }

    var dirTargetPaths:string[]=[]; //array of target paths of all dirs in the target path
    var imgNames:string[]=_.filter(targetItemNames,(x:string)=>{
        if (fs.statSync(join(imageDataPath,targetPath,x)).isDirectory())
        {
            dirTargetPaths.push(normalize(posix.join(targetPath,x)));
            return false;
        }

        return true;
    });

    // converting all images to final abstract path
    imgNames=_.map(imgNames,(x:string)=>{
        return normalize(`/imagedata/${targetPath}/${x}`);
    });

    // img results from subdirs
    var subDirResults:string[][]=_.flatten(_.map(dirTargetPaths,(x:string)=>{
        return getImagesInPath2(imageDataPath,x);
    }));

    return _.shuffle([...subDirResults,imgNames]);
}

// given an album path within imagedata, return the urls for that path.
function DEP_getImagesInPath(imageDataPath:string,targetPath:string,thumbnails?:boolean):string[]
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

    var imageType:string=thumbnails?"thumbnaildata":"imagedata";

    return _.map(imgs,(x:string)=>{
        return `/${imageType}/${targetPath}/${x}`;
    });
}