import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import _ from "lodash";
import {join} from "path";

const _imageDataDir:string="../../h/cg/";
const _thumbnailDataDir:string="../thumbnaildata2";

async function main():Promise<void>
{
    var paths:string[]=await getDirItems(njoin(_imageDataDir,"grimgrim"));

    console.log(paths);

    console.log(njoin(_imageDataDir,paths[0]));
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

/** join with normalisation */
function njoin(...paths:string[]):string
{
    return normalise(join(...paths));
}

main();