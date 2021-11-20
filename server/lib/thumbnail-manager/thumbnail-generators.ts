import imageThumbnail from "image-thumbnail";
import videoThumbnail from "video-thumbnail-generator";
import {ensureDirSync,writeFile} from "fs-extra";
import {basename,dirname,extname} from "path";
import _ from "lodash";
import chalk from "chalk";

/** generate thumbnails for an array of thumbnail gen jobs, in chunks. */
export async function generateThumbnails(jobs:ThumbnailGenJob[],chunks:number=5):Promise<void>
{
    var chunkJobs:ThumbnailGenJob[][]=_.chunk(jobs,chunks);

    for (var x=0,l=chunkJobs.length;x<l;x++)
    {
        console.log(`${chalk.yellow("progress")} ${x+1}/${chunkJobs.length}:`);
        await generateThumbnailsNoChunk(chunkJobs[x]);
        console.log();
    }
}

/** generate thumbnails for array of thumbnail gen jobs, without chunking */
async function generateThumbnailsNoChunk(jobs:ThumbnailGenJob[]):Promise<void[]>
{
    return Promise.all(_.map(jobs,(x:ThumbnailGenJob)=>{
        console.log(chalk.green("generating"),x.fullPath);

        if (isVideoExt(x.originalExt))
        {
            return generateVideoThumbnail(x.fullPath,x.thumbnailPath);
        }

        else if (isImageExt(x.originalExt))
        {
            return generateImageThumbnail(x.fullPath,x.thumbnailPath);
        }

        else
        {
            console.log(chalk.red("unsupported img format, skipping"));
        }
    }));
}

/** async generate thumbnail for given full path to an image. give it the FULL PATH to the output,
 *  including the file extension
 *  - path: full path to the image from the cwd
 *  - outputPath: path to the output image, as a jpg, from the cwd*/
async function generateImageThumbnail(path:string,outputPath:string):Promise<void>
{
    if (isVideo(path))
    {
        console.error(chalk.red("attempted to generate image thumbnail on video"));
        return;
    }

    var thumbnail:Buffer=await imageThumbnail(path,{
        width:160,
        height:160,
        responseType:"buffer",
        jpegOptions:{
            force:true,
            quality:80
        },
        fit:"cover"
    } as any);

    ensureDirSync(dirname(outputPath));

    writeFile(outputPath,thumbnail,(err:NodeJS.ErrnoException)=>{
        if (err)
        {
            console.error(chalk.red("image thumbnail generate write err"),err);
        }
    });
}

/** async generate thumbnail for a full path to a video. give full path to the output, including extension.*/
async function generateVideoThumbnail(target:string,outputPath:string):Promise<void>
{
    if (!isVideo(target))
    {
        console.error(chalk.red("attempted to generate video thumbnail on non-video"));
        return;
    }

    ensureDirSync(dirname(outputPath));

    try
    {
        await new videoThumbnail({
            sourcePath:target,
            thumbnailPath:dirname(outputPath)
        }).generate({
            size:"200x?",
            count:1,
            filename:basename(outputPath)
        });
    }

    catch (err)
    {
        console.log(chalk.red("possible video thumbnail generate error"));
        console.log(chalk.red(">   "),chalk.red(target));
    }
}

/** determine if given path is a video or not */
function isVideo(path:string,noExtract:boolean=false):boolean
{
    return isVideoExt(extname(path));
}

/** determine if an extension only is a video or not */
function isVideoExt(ext:string):boolean
{
    switch (ext)
    {
        case ".mp4":
        case ".webm":
        case ".avi":
        return true;
    }

    return false;
}

/** determine if img is supported img extension */
function isImageExt(ext:string):boolean
{
    switch (ext)
    {
        case ".png":
        case ".jpg":
        case ".jpeg":
        case ".gif":
        return true;
    }

    return false;
}