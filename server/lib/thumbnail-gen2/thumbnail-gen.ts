import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import _ from "lodash";
import {relative,resolve,join,parse} from "path";
import {access} from "fs/promises";

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

function main()
{
    getTargetFiles("C:/Users/ktkm/Desktop/h/3d/nagoo").then(async (res:TargetItem[])=>{
        console.log(await determineThumbnailsNeedGeneration(resolveThumbnailPaths(res,"./thumbnaildata/nagoo")));
    });
}

main();