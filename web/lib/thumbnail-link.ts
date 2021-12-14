// lib for dealing with url conversions to thumbnail urls

/** match url after /imagedata
 *  [1]: the url */
const _imageDataMatch:RegExp=/\/imagedata(.*)/;

/** do image url to thumbnail url conversion based on configured operation mode */
export function imageUrlToThumbnailUrl(
    imageUrl:string,
    cloudMode:boolean,
    cloudOptions?:CloudModeConfiguration
):string
{
    if (!cloudMode || !cloudOptions)
    {
        return localModeReplace(imageUrl);
    }

    else
    {
        return cloudModeMatch(imageUrl,cloudOptions);
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
function cloudModeMatch(imageUrl:string,options:CloudModeConfiguration):string
{
    /** match url after some cloud bucket url name
     *  [1]: the url */
    const cloudMatch:RegExp=new RegExp(`\/${options.mainUrl}(.*)`);
    const match:RegExpMatchArray|null=imageUrl.match(cloudMatch);

    if (!match || match.length!=2)
    {
        return "";
    }

    return "https://storage.googleapis.com/"+
        cleanUrlForThumbnail(options.thumbnailUrl+match[1]);
}

/** do some cleaning and extension replacement to do final conversions for image url to thumbnail url */
function cleanUrlForThumbnail(url:string):string
{
    return url
        .replace(/mp4|webm|png|jpeg|webp|gif/,"jpg")
        .replace(/\/\//,"/");
}