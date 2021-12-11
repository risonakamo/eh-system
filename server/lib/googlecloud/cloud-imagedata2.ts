import _ from "lodash";
import {Bucket,File} from "@google-cloud/storage";

/** get image data from a target path in a cloud bucket in flat directory form */
export async function getCloudImageDataFlatDir(
    targetpath:string,
    bucket:Bucket
):Promise<ImageDataFlatDir>
{
    const [files]=await bucket.getFiles({
        prefix:targetpath
    });

    const imagedata:CloudImageData[]=_.filter(_.map(files,(file:File):CloudImageData|null=>{
        const extractedFolderName:string|null=extractFolder(file.name);

        if (!extractedFolderName)
        {
            return null;
        }

        return {
            cloudpath:file.name,
            folderPath:extractedFolderName,
            url:file.publicUrl()
        };
    })) as CloudImageData[];

    return _.groupBy(imagedata,(data:CloudImageData):string=>{
        return data.folderPath;
    });
}

/** get cloud image data in string array form (each album is array of strings, all albums are shuffled,
 *  and flattened) */
export async function getCloudImageDataUrls(targetpath:string,bucket:Bucket):Promise<string[]>
{
    // remove initial slash if exists
    if (targetpath[0]=="/")
    {
        targetpath=targetpath.slice(1);
    }

    const imagedata:ImageDataFlatDir=await getCloudImageDataFlatDir(targetpath,bucket);

    return _.flatten(_.shuffle(_.map(imagedata,(x:CloudImageData[]):string[]=>{
        return _.map(x,(y:CloudImageData):string=>{
            return y.url;
        });
    })));
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