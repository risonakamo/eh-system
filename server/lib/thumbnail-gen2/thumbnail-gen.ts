import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import _ from "lodash";
import {relative,resolve,join,parse,extname} from "path";
import {access} from "fs/promises";

import {generateThumbnails} from "../thumbnail-manager/thumbnail-generators";

/** generate all missing thumbnails for a target directory */
export async function generatedNeededThumbnails(inputdir:string,outputdir:string,batchsize:number=5)
:Promise<void>
{
    // initial calculation of all input files in the input dir
    const inputtargets:TargetItem[]=await getTargetFiles(inputdir);

    // resolve thumbnail output paths and prune to only thumbnails that need to be generated
    const gentargets:ThumbnailTargetItem[]=await determineThumbnailsNeedGeneration(
        resolveThumbnailPaths(inputtargets,outputdir)
    );

    // convert gen targets to proper input object and perform generation
    generateThumbnails(
        thumbnailTargetItemsToGenJobs(gentargets),
        batchsize
    );
}

/** resolve information for all items recursively in target directory */
async function getTargetFiles(inputdir:string):Promise<TargetItem[]>
{
    inputdir=normalise(resolve(inputdir));

    return _.map(await recursiveDir(inputdir),(x:string):TargetItem=>{
        return {
            basepath:inputdir,
            fullpath:normalise(x),

            filepath:normalise(parse(relative(inputdir,x)).dir),
            filename:normalise(parse(x).name)
        };
    });
}

/** convert target items to absolute thumbnail paths */
function resolveThumbnailPaths(targets:TargetItem[],outputdir:string):ThumbnailTargetItem[]
{
    outputdir=normalise(resolve(outputdir));

    return _.map(targets,(x:TargetItem):ThumbnailTargetItem=>{
        return {
            originalpath:x.fullpath,
            thumbnailpath:normalise(join(outputdir,x.filepath,x.filename+".jpg"))
        };
    });
}

/** filter array of thumbnail target items to only items where the target thumbnail does NOT exist */
async function determineThumbnailsNeedGeneration(thumbnailtargets:ThumbnailTargetItem[])
:Promise<ThumbnailTargetItem[]>
{
    // async check all items for existance. IF IT EXISTS, IT WILL BE NULL. so the only remaining items
    // should all be items that DO NOT exist
    const existCheck:Promise<ThumbnailTargetItem|null>[]=_.map(
        thumbnailtargets,
        async (x:ThumbnailTargetItem):Promise<ThumbnailTargetItem|null>=>{
            try
            {
                await access(x.thumbnailpath);
                return null;
            }

            catch
            {
                return x;
            }
        }
    );

    // wait for all checks to resolve. then filter out all nulls
    return _.filter(await Promise.all(existCheck)) as ThumbnailTargetItem[];
}

/** convert thumbnail target items to gen jobs usable by thumbnail-generators library. some fields are
 *  left out because they are not needed by thumbnail-generators */
function thumbnailTargetItemsToGenJobs(thumbnailtargets:ThumbnailTargetItem[]):ThumbnailGenJob[]
{
    return _.map(thumbnailtargets,(x:ThumbnailTargetItem):ThumbnailGenJob=>{
        return {
            relPath:"",
            thumbnailDir:"",

            fullPath:x.originalpath,
            thumbnailPath:x.thumbnailpath,
            originalExt:extname(x.originalpath)
        };
    });
}