import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import _ from "lodash";
import replaceExt from "replace-ext";
import {join,dirname,extname} from "path";
import prompts from "prompts";
import chalk from "chalk";
import del from "del";

import {generateThumbnails} from "./thumbnail-generators";

// PATHS SHOULD BE RELATIVE TO THE CURRENT DIRECTORY EXECUTING THE FILE FROM, NOT WHERE THIS FILE IS LOCATED
const _imageDataDir:string="../../h/3d";
const _thumbnailDataDir:string="thumbnaildata2";
const _targetDir:string="noname"; //target dir from the base image data dir to generate thumbnails for.
const _batchSize:number=6;

async function main():Promise<void>
{
    var imagedir:string=njoin(_imageDataDir,_targetDir);
    var thumbnaildir:string=njoin(_thumbnailDataDir,_targetDir);

    var paths:string[]=await getDirItems(imagedir);
    var jobs:ThumbnailGenJob[]=resolveThumbnailJobs(imagedir,thumbnaildir,paths);

    await clearDir(thumbnaildir);
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

/** clear the target folder, after prompting to clear or not */
async function clearDir(target:string):Promise<void>
{
    var response=await prompts({
        type:"confirm",
        name:"doDelete",
        message:`confirm clear ${chalk.green(target)}`
    });

    if (!response.doDelete)
    {
        console.log(chalk.red("not deleting"));
        return;
    }

    del.sync(njoin(target,"*"));
    console.log(`cleared ${chalk.red(target)}`);
}

main();