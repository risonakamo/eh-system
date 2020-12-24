import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import _ from "lodash";
import replaceExt from "replace-ext";
import {join,dirname,extname} from "path";

import {generateThumbnails} from "./thumbnail-generators";

// PATHS SHOULD BE RELATIVE TO THE CURRENT DIRECTORY EXECUTING THE FILE FROM, NOT WHERE THIS FILE IS LOCATED
const _imageDataDir:string="../../h/3d/noname/honoka";
const _thumbnailDataDir:string="thumbnaildata2/noname/honoka";
const _batchSize:number=6;

async function main():Promise<void>
{
    var paths:string[]=await getDirItems(_imageDataDir);
    var jobs:ThumbnailGenJob[]=resolveThumbnailJobs(_imageDataDir,_thumbnailDataDir,paths);

    generateThumbnails(jobs,_batchSize);
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

/** join with normalisation */
function njoin(...paths:string[]):string
{
    return normalise(join(...paths));
}

main();