import _ from "lodash";
import {Bucket,File} from "@google-cloud/storage";

/** retrieve image data from cloud api in array form (not keyed by dirname path) and with shuffling */
export async function getCloudImageData(targetpath:string,bucket:Bucket):Promise<string[][]>
{
    const imagedatadict:ImageDataDirs=await getCloudImageDataDict(targetpath,bucket);

    return _.shuffle(_.map(imagedatadict,(files:string[]):string[]=>{
        return files;
    }));
}

/** retrieve image data from cloud api bucket. key images by their full dirname path */
export async function getCloudImageDataDict(targetpath:string,bucket:Bucket):Promise<ImageDataDirs>
{
    const [files]=await bucket.getFiles({
        prefix:targetpath
    });

    var filesByDir:Record<string,File[]>=_.groupBy(files,(x:File):string=>{
        const dirname:string|null=extractFolder(x.name);

        if (!dirname)
        {
            return "___ERROR___";
        }

        return dirname;
    });

    delete filesByDir["__ERROR__"];

    return _.mapValues(filesByDir,(files:File[]):string[]=>{
        return _.map(files,(file:File):string=>{
            return file.name;
        });
    });
}

/** given image data dirs and a target path, filter down to only the image data dirs that are immediately
 * under the target path */
export function getImmediateDirs(targetpath:string,imagedirs:ImageDataDirs):ImageDataDirs
{
    return _.pickBy(imagedirs,(images:string[],imagedirname:string):boolean=>{
        return checkImmediateDir(imagedirname,targetpath);
    });
}

/** get names of dirs that exist one level below the target path. the imagedirs must have been generated
 *  using the same targetpath, or results will be inaccurate */
export function getImmediateDirNames(targetpath:string,imagedirs:ImageDataDirs):string[]
{
    var names:Set<string>=new Set();

    for (var name in imagedirs)
    {
        var immediateName:string|null=firstNotEmpty(name.replace(targetpath,"").split("/"));

        if (!immediateName)
        {
            throw Error(`getImmediateDirNames: failed to parse dir name ${name}`);
        }

        names.add(immediateName);
    }

    return [...names];
}

// [1]: full folder name path of input image
const _nameExtract:RegExp=/(.*)\//;

/** attempt to extract folder name from an image url */
function extractFolder(imagepath:string):string|null
{
    const match:RegExpMatchArray|null=imagepath.match(_nameExtract);

    if (!match || !match.length)
    {
        console.error("warning: failed to extract folder name from url");
        console.error(imagepath);
        return null;
    }

    return match[1];
}

/** check if a dirname is an immediate child of a target path */
function checkImmediateDir(dirname:string,targetpath:string):boolean
{
    return _.filter(dirname.replace(targetpath,"").split("/")).length==1;
}

/** return the first item in an array that is not an empty string */
function firstNotEmpty(array:string[]):string|null
{
    for (var i=0,l=array.length;i<l;i++)
    {
        var x:string=array[i];
        if (x.length)
        {
            return x;
        }
    }

    return null;
}