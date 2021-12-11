import _ from "lodash";
import {Bucket,File,Storage} from "@google-cloud/storage";

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

/** test getting imagedata in flat dir form */
export async function test1()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket:Bucket=storage.bucket("ktkm-albumviewer-images");

    const imagedata:ImageDataFlatDir=await getCloudImageDataFlatDir("stuff/dark",bucket);
    console.log(imagedata);
}