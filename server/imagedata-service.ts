import fs from "fs";
import _ from "lodash";

// given an album path within imagedata, return the urls for that path.
export function getImagesInPath(path:string):string[]
{
    var imgs:string[];

    try
    {
        imgs=fs.readdirSync(`${__dirname}/../imagedata/${path}`);
    }

    catch (err)
    {
        return [];
    }

    return _.map(imgs,(x:string)=>{
        return `/imagedata/${path}/${x}`;
    });
}