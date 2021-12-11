import _ from "lodash";
import {join} from "path";
import normalize from "normalize-path";

/** convert image data flat dir to sub dir form relative to some target path */
export function toSubDirForm(imagedata:ImageDataFlatDir,targetpath:string):ImageDataSubDir
{
    return _.reduce(imagedata,
    (r:ImageDataSubDir,data:CloudImageData[],fullpath:string):ImageDataSubDir=>{
        // remove the target from the dir path
        const withoutTarget:string=fullpath.replace(targetpath,"");

        // attempt to parse the path and take the first item, which should now be the name of a directory
        // that is under the target path
        const firstSubDir:string|null=firstNotEmpty(withoutTarget.split("/"));

        if (!firstSubDir)
        {
            return r;
        }

        // reconstruct the full sub dir path by adding the targetpath back
        const subDirPath:string=normalize(join(targetpath,firstSubDir));

        // add the fullpath and data under the determined subdir path name
        if (!(subDirPath in r))
        {
            r[subDirPath]={};
        }

        r[subDirPath][fullpath]=data;

        return r;
    },{});
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