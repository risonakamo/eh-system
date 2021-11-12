/** path resolution related functions for thumbnail management **/

import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import {join} from "path";
import _ from "lodash";

/** return path of files, relative to the intially given target path */
export async function getDirItems(target:string):Promise<string[]>
{
    target=normalise(target);
    var paths:string[]=await recursiveDir(target);

    return _.map(paths,(x:string)=>{
        return normalise(x).replace(target,"");
    });
}

/** join with normalisation */
export function njoin(...paths:string[]):string
{
    return normalise(join(...paths));
}

/** attempt to get the number of items inside of a dir, recursively (counts all items in subdirectories) */
export async function getDirItemsSize(target:string):Promise<number>
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