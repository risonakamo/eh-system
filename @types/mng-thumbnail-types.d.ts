interface ThumbnailGenJob
{
    relPath:string //path relative to the base path
    fullPath:string //full path including the base path

    thumbnailDir:string //path to the folder where the thumbnail should exist
    thumbnailPath:string //path to where the thumbnail should exist, include the thumbnail filename and extension

    originalExt:string //original file extension
}

interface MngThumbnailArgsMeowInner
{
    baseDir:{
        type:"string"
        default:string
    }
    batchSize:{
        type:"number"
        default:number
    }
}

type MngThumbnailArgsMeow=import("meow").Result<MngThumbnailArgsMeowInner>

interface MngThumbnailArgs
{
    targetDir:string
    baseDir:string
    batchSize:number
}