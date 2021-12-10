import _ from "lodash";
import {Bucket,File} from "@google-cloud/storage";

/** retrieve image data from cloud api */
export async function getCloudImageData(targetpath:string,bucket:Bucket):Promise<string[][]>
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

    return _.map(filesByDir,(filelist:File[]):string[]=>{
        return _.map(filelist,(file:File):string=>{
            return file.name;
        });
    });
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