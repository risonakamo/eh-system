import imageThumbnail from "image-thumbnail";
import videoThumbnail from "video-thumbnail-generator";
import {ensureDirSync,writeFile} from "fs-extra";
import {basename,dirname,extname} from "path";

/** async generate thumbnail for given full path to an image. give it the FULL PATH to the output,
 *  including the file extension
 *  - path: full path to the image from the cwd
 *  - outputPath: path to the output image, as a jpg, from the cwd*/
export async function generateImageThumbnail(path:string,outputPath:string):Promise<void>
{
    if (isVideo(path))
    {
        console.error("attempted to generate image thumbnail on video");
        return;
    }

    var thumbnail:Buffer=await imageThumbnail(path,{
        width:180,
        height:180,
        responseType:"buffer",
        jpegOptions:{
            force:true,
            quality:80
        },
        fit:"cover"
    } as any);

    ensureDirSync(dirname(outputPath));

    writeFile(outputPath,thumbnail,(err:NodeJS.ErrnoException)=>{
        if (err)
        {
            console.error("image thumbnail generate write err",err);
        }
    });
}

/** async generate thumbnail for a full path to a video. give full path to the output, including extension.*/
export async function generateVideoThumbnail(target:string,outputPath:string):Promise<void>
{
    if (!isVideo(target))
    {
        console.error("attempted to generate video thumbnail on non-video");
        return;
    }

    ensureDirSync(dirname(outputPath));

    await new videoThumbnail({
        sourcePath:target,
        thumbnailPath:dirname(outputPath)
    }).generate({
        size:"200x?",
        count:1,
        filename:basename(outputPath)
    });
}

/** determine if given path is a video or not */
function isVideo(path:string):boolean
{
    var ext:string=extname(path);

    return ext==".mp4" || ext==".webm";
}