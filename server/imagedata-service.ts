import fs from "fs";
import _ from "lodash";
import {join} from "path";

// given an album path within imagedata, return the urls for that path.
export function getImagesInPath(imageDataPath:string,targetPath:string):string[]
{
    var imgs:string[];

    try
    {
        imgs=fs.readdirSync(join(imageDataPath,targetPath));
    }

    catch (err)
    {
        return [];
    }

    return _.map(imgs,(x:string)=>{
        return `/imagedata/${targetPath}/${x}`;
    });
}