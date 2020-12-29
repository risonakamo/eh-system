import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import _ from "lodash";
import replaceExt from "replace-ext";
import {join,dirname,extname} from "path";
import prompts from "prompts";
import chalk from "chalk";
import del from "del";
import meow from "meow";

import {generateThumbnails} from "./thumbnail-generators";

// PATHS SHOULD BE RELATIVE TO THE CURRENT DIRECTORY EXECUTING THE FILE FROM, NOT WHERE THIS FILE IS LOCATED
const _thumbnailDataDir:string="thumbnaildata";

// default values
const _imageDataDir:string="../../h/cg";
const _batchSize:number=6;

async function main():Promise<void>
{
    var args:MngThumbnailArgs=getArgs();

    generateThumbnailsWrap(args.baseDir,_thumbnailDataDir,args.targetDir,null,args.batchSize);
}

/** wrapper function for generate thumbnails activity.
 *  - imageBaseDir: base directory of images
 *  - targetBaseDir: base directory to place output thumbnails
 *  - target: path **RELATIVE TO THE PREVIOUSLY GIVEN BASE IMAGE DIR** to generate thumbnails for.
 *    for example, to generate all thumbnails give "." or "/".
 *  - promptClearDir: ask to clear the output dir or not. provide null to ask, provide true to clear, provide
 *    false to not clear. default is to ask.
 *  - batchSize: batch size to use
 *  - quitIfExists: check if the thumbnail dir has a similar number of items to the image dir attempting to generate
 *    for. if it does, then quits. */
async function generateThumbnailsWrap(imageBaseDir:string,thumbnailBaseDir:string,target:string,
    doClearDir:boolean|null=null,batchSize:number=6,quitIfExists:boolean=false):Promise<void>
{
    // get image dir
    var imagedir:string=njoin(imageBaseDir,target);
    // get thumbnail dir
    var thumbnaildir:string=njoin(thumbnailBaseDir,target);

    // get all image paths recursively.
    var paths:string[]=await getDirItems(imagedir);

    // if quit if exists set, checks the number of images in thumbnail dir. if an equal number, then quits.
    if (quitIfExists)
    {
        var existingThumbnails:number=await getDirItemsSize(thumbnaildir);
        if (paths.length==existingThumbnails)
        {
            console.log(chalk.blue("cancelling thumbnail generation due to existence check"));
            return;
        }
    }

    // ask to clear if not set
    if (doClearDir==null)
    {
        await clearDir(thumbnaildir);
    }

    // if set to true, always clear, otherwise, do not clear
    else if (doClearDir==true)
    {
        await clearDir(thumbnaildir,true);
    }

    // create thumbnail gen jobs
    var jobs:ThumbnailGenJob[]=resolveThumbnailJobs(imagedir,thumbnaildir,paths);

    // perform generation
    generateThumbnails(jobs,batchSize);
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

/** clear the target folder, after prompting to clear or not. give force to just clear without asking */
async function clearDir(target:string,force:boolean=false):Promise<void>
{
    // do not ask if force
    if (!force)
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
    }

    del.sync(njoin(target,"*"));
    console.log(`cleared ${chalk.red(target)}`);
}

/** attempt to get the number of items inside of a dir, recursively (counts all items in subdirectories) */
async function getDirItemsSize(target:string):Promise<number>
{
    try
    {
        return (await getDirItems(target)).length;
    }

    catch (err)
    {
        return 0;
    }
}

/** get mng thumbnail args */
function getArgs():MngThumbnailArgs
{
    var args:MngThumbnailArgsMeow=meow(`
        mng-thumbnails [flags] <TARGET-DIR>

        args:
        - TARGET-DIR: path to directory to regenerate thumbnails for, ${chalk.green("relative to the base image dir")}

        flags:
        --base-dir <path>: path to base image dir to use
        --batch-size <number>: generator processing batch size
    `,{
        flags:{
            baseDir:{
                type:"string",
                default:_imageDataDir
            },
            batchSize:{
                type:"number",
                default:_batchSize
            }
        }
    });

    if (args.input.length!=1)
    {
        args.showHelp();
    }

    return {
        targetDir:args.input[0],
        baseDir:args.flags.baseDir,
        batchSize:args.flags.batchSize
    };
}

main();