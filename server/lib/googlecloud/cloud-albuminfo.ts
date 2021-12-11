import _ from "lodash";
import {Bucket,File} from "@google-cloud/storage";

import {getCloudImageDataDict,getImmediateDirNames,getImmediateDirs} from "./cloud-imagedata";

async function getCloudAlbumInfo(targetpath:string,bucket:Bucket):AlbumInfo[]
{
    const imagedata:ImageDataDirs=await getCloudImageDataDict(targetpath,bucket);
    const topDirs:string[]=getImmediateDirNames(targetpath,imagedata);

    return _.map(topDirs,(topDirName:string):AlbumInfo=>{
        const subtargetPath:string=`${targetpath}/${topDirName}`;
        const subDirData:ImageDataDirs=getImmediateDirs(subtargetPath,imagedata);
        const topOfSubDir:string[]=getImmediateDirNames(subtargetPath,subDirData);

        return {
            title:topDirName,
            items:0,
            immediateItems:topOfSubDir.length,
            img:"",
            date:"",
            album:false
        };
    });
}