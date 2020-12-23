import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import _ from "lodash";
import replaceExt from "replace-ext";
import {join,dirname,extname,basename} from "path";
import imageThumbnail from "image-thumbnail";
import videoThumbnail from "video-thumbnail-generator";
import {ensureDirSync,writeFile} from "fs-extra";

// PATHS SHOULD BE RELATIVE TO THE CURRENT DIRECTORY EXECUTING THE FILE FROM, NOT WHERE THIS FILE IS LOCATED
const _imageDataDir:string="../../h/cg/grimgrim";
const _thumbnailDataDir:string="thumbnaildata2";
const _batchSize:number=5;

async function main():Promise<void>
{
    var paths:string[]=await getDirItems(_imageDataDir);
    var jobs:ThumbnailGenJob[]=resolveThumbnailJobs(_imageDataDir,_thumbnailDataDir,paths);

    generateImageThumbnail(jobs[0].fullPath,jobs[0].thumbnailPath);

    console.log(jobs[22]);
    generateVideoThumbnail(jobs[22].fullPath,jobs[22].thumbnailPath);

    console.log(jobs[21]);
    generateVideoThumbnail(jobs[21].fullPath,jobs[21].thumbnailPath);
}

/** return path of files, relative to the intially given target path */
async function getDirItems(target:string):Promise<string[]>
{
    target=normalise(target);
    var paths:string[]=await recursiveDir(target);

    return _.map(paths,(x:string)=>{
        return normalise(x).replace(target,"");
    });
}

/** resolve array of paths RELATIVE TO THE BASEPATH to extra information including thumbnail output location.
 *  basepath and thumbnail dir should be relative to the cwd.*/
function resolveThumbnailJobs(basepath:string,thumbnaildir:string,relpaths:string[]):ThumbnailGenJob[]
{
    return _.map(relpaths,(x:string):ThumbnailGenJob=>{
        var fullPath:string=njoin(basepath,x);
        var thumbnailPath:string=normalise(replaceExt(njoin(thumbnaildir,x),".jpg"));

        return {
            relPath:x,
            fullPath,
            thumbnailDir:normalise(dirname(thumbnailPath)),
            thumbnailPath,
            originalExt:extname(x)
        };
    });
}

/** async generate thumbnail for given full path to an image. give it the FULL PATH to the output,
 *  including the file extension
 *  - path: full path to the image from the cwd
 *  - outputPath: path to the output image, as a jpg, from the cwd*/
async function generateImageThumbnail(path:string,outputPath:string):Promise<void>
{
    var thumbnail:Buffer=await imageThumbnail(path,{
        width:180,
        height:180,
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
            console.log("image thumbnail generate write err",err);
        }
    });
}

/** async generate thumbnail for a full path to a video. give full path to the output, including extension.*/
async function generateVideoThumbnail(target:string,outputPath:string):Promise<void>
{
    ensureDirSync(dirname(outputPath));

    await new videoThumbnail({
        sourcePath:target,
        thumbnailPath:dirname(outputPath)
    }).generate({
        size:"200x?",
        count:1,
        filename:basename(outputPath)
    });
}

/** join with normalisation */
function njoin(...paths:string[]):string
{
    return normalise(join(...paths));
}

main();