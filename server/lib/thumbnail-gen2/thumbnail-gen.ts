import recursiveDir from "recursive-readdir";
import normalise from "normalize-path";
import _ from "lodash";
import {relative,resolve,join,parse} from "path";

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
function resolveThumbnailPaths(targets:TargetItem[],outputdir:string):string[]
{
    outputdir=normalise(resolve(outputdir));

    return _.map(targets,(x:TargetItem):string=>{
        return normalise(join(outputdir,x.filepath,x.filename+".jpg"));
    });
}

function main()
{
    getTargetFiles("C:/Users/ktkm/Desktop/h/cg/healthyman").then((res:TargetItem[])=>{
        console.log(resolveThumbnailPaths(res,"./thumbnaildata2"));
    });
}

main();