import fs from "fs-extra";
import {join} from "path";
import _ from "lodash";
import moment from "moment";
import normalize from "normalize-path";
import {isDirectorySync} from "path-type";

import {getImagesInPath2} from "./imagedata-service";

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

    return _.filter(_.map(items,(x:string)=>{
        var fullitempath:string=join(fullTargetPath,x);

        if (!isDirectorySync(fullitempath))
        {
            return null;
        }

        var imagesAtDir:string[]=getImagesInPath2(imageDataPath,join(targetPath,x));

        return {
            title:x,
            items:imagesAtDir.length,
            img:normalize(_.sample(imagesAtDir) as string).replace("imagedata","thumbnaildata"),
            date:moment(fs.statSync(fullitempath).mtime).format("YYYY-MM-DD"),
            album:pathHasNoSubDirs(fullitempath)
        };
    })) as AlbumInfo[];
}

// determine if a path has no sub directories in it.
function pathHasNoSubDirs(fullpath:string):boolean
{
    var items:string[]=fs.readdirSync(fullpath);

    return !_.some(items,(x:string)=>{
        return fs.statSync(join(fullpath,x)).isDirectory();
    });
}