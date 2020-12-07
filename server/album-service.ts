import fs from "fs-extra";
import {join} from "path";
import _ from "lodash";
import moment from "moment";
import normalize from "normalize-path";
import {isDirectorySync} from "path-type";

import {getImagesInPath2Flat,videoPathToImagePath} from "./imagedata-service";

// given a target album path within the imagedata folder, return album information for items
// in that folder.
export function getAlbumInfo(imageDataPath:string,targetPath:string):AlbumInfo[]
{
    var items:string[];
    var fullTargetPath:string=join(imageDataPath,targetPath);

    try
    {
        items=fs.readdirSync(fullTargetPath);
    }

    catch (err)
    {
        return [];
    }

    return (_.filter(_.map(items,(x:string):AlbumInfo|null=>{
        var fullitempath:string=join(fullTargetPath,x);

        if (!isDirectorySync(fullitempath))
        {
            return null;
        }

        var imagesAtDir:string[]=getImagesInPath2Flat(imageDataPath,join(targetPath,x));

        if (!imagesAtDir.length)
        {
            return null;
        }

        return {
            title:x,
            items:imagesAtDir.length,
            immediateItems:fs.readdirSync(fullitempath).length,
            img:normalize(
                videoPathToImagePath(
                    _.sample(imagesAtDir)!.replace("imagedata","thumbnaildata")
                )
            ),
            date:moment(fs.statSync(fullitempath).mtime).format("YYYY/MM/DD"),
            album:pathHasNoSubDirs(fullitempath)
        };
    })) as AlbumInfo[]).sort(albumInfoDateSort);
}

// determine if a path has no sub directories in it.
function pathHasNoSubDirs(fullpath:string):boolean
{
    var items:string[]=fs.readdirSync(fullpath);

    return !_.some(items,(x:string)=>{
        return fs.statSync(join(fullpath,x)).isDirectory();
    });
}

// sort by date for album infos
function albumInfoDateSort(a:AlbumInfo,b:AlbumInfo):number
{
    var adate:Date=new Date(a.date);
    var bdate:Date=new Date(b.date);

    if (adate>bdate)
    {
        return -1;
    }

    else if (adate<bdate)
    {
        return 1;
    }

    return 0;
}