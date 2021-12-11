import _ from "lodash";
import {Bucket,File} from "@google-cloud/storage";

import {getCloudImageDataFlatDir} from "./cloud-imagedata2";
import {toSubDirForm} from "./cloud-subdirform";

/** get cloud album info */
export async function getCloudAlbumInfo(targetpath:string,bucket:Bucket):Promise<AlbumInfo[]>
{
    const imagedata:ImageDataFlatDir=await getCloudImageDataFlatDir(targetpath,bucket);
    const subdirs:ImageDataSubDir=toSubDirForm(imagedata,targetpath);

    return _.map(subdirs,(subdirData:ImageDataFlatDir,i:string):AlbumInfo=>{
        // the subdir form of this subdir
        const subdirsOfSubDir:ImageDataSubDir=toSubDirForm(subdirData,i);

        // all the individual items in this subdir
        const flattenedItems:CloudImageData[]=_.flatMap(subdirData);

        // image data keys includes every single fodler path that is a leaf node. if a subdir has the same
        // name as one of these paths, then it is an album
        const isAlbum:boolean=i in imagedata;

        return {
            title:i,
            items:flattenedItems.length,
            immediateItems:_.keys(subdirsOfSubDir).length,
            img:_.sample(flattenedItems)!.url,
            date:"",
            album:isAlbum
        };
    });
}