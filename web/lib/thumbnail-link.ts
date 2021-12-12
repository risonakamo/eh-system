// lib for dealing with url conversions to thumbnail urls

import {CLOUD_MODE,CLOUD_MAIN_BUCKET,CLOUD_THUMBNAIL_BUCKET} from "lib/defines";

/** match url after /imagedata
 *  [1]: the url */
const _imageDataMatch:RegExp=/\/imagedata(.*)/;

/** match url after some cloud bucket url name
 *  [1]: the url */
const _cloudMatch:RegExp=new RegExp(`\/${CLOUD_MAIN_BUCKET}(.*)`);

/** do image url to thumbnail url conversion based on configured operation mode */
export function imageUrlToThumbnailUrl(imageUrl:string):string
{
    if (!CLOUD_MODE)
    {
        return localModeReplace(imageUrl);
    }

    else
    {
        return cloudModeMatch(imageUrl);
    }
}

/** determine thumbnail url for an image url from locally hosted server */
function localModeReplace(imageUrl:string):string
{
    const match:RegExpMatchArray|null=imageUrl.match(_imageDataMatch);

    if (!match || match.length!=2)
    {
        return "";
    }

    return cleanUrlForThumbnail(`/thumbnaildata/${match[1]}`);
}

/** determine thumbnail url while using google cloud operation mode */
function cloudModeMatch(imageUrl:string):string
{
    const match:RegExpMatchArray|null=imageUrl.match(_cloudMatch);

    if (!match || match.length!=2)
    {
        return "";
    }

    return cleanUrlForThumbnail(
        `https://storage.googleapis.com/`
        +`${CLOUD_THUMBNAIL_BUCKET}${match[1]}`
    );
}

/** do some cleaning and extension replacement to do final conversions for image url to thumbnail url */
function cleanUrlForThumbnail(url:string):string
{
    return url
        .replace(/mp4|webm|png|jpeg|webp|gif/,"jpg")
        .replace(/\/\//,"/");
}