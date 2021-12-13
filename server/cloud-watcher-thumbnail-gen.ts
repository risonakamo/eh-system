import replaceExt from "replace-ext";
import {PubSub,Subscription,Message} from "@google-cloud/pubsub";
import {Storage,Bucket,File} from "@google-cloud/storage";
import {yellow,green,blue,red,magenta} from "chalk";
import {basename} from "path";
import {join} from "path";
import normalize from "normalize-path";
import {ensureDirSync} from "fs-extra";

import {generateSingleThumbnail} from "./lib/thumbnail-manager/thumbnail-generators";

const _projectId:string="cloud-class-albumviewer";
const _mainImageBucketSubscription:string="imagebucket-events-sub";

const _mainImageBucketName:string="ktkm-albumviewer-images";
const _thumbnailBucketName:string="ktkm-albumviewer-thumbnails";

const _tmpImageDownloadDir:string="cloudthumbnailgen_tmp/downloads";
const _tmpGeneratedThumbnailsDir:string="cloudthumbnailgen_tmp/thumbnails";

async function main()
{
    ensureDirSync(_tmpImageDownloadDir);
    ensureDirSync(_tmpGeneratedThumbnailsDir);

    const pubsub=new PubSub({
        projectId:_projectId,
        keyFilename:"config/cloudkey.json"
    });

    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const subscription:Subscription=pubsub.subscription(_mainImageBucketSubscription);

    const imageBucket:Bucket=storage.bucket(_mainImageBucketName);
    const thumbnailBucket:Bucket=storage.bucket(_thumbnailBucketName);

    var handledImages:Set<string>=new Set();

    subscription.on("message",async (msg:Message)=>{
        const attributes:CloudStoragePubSubMessageAttributes=(
            msg.attributes as any as CloudStoragePubSubMessageAttributes
        );

        if (attributes.eventType=="OBJECT_FINALIZE")
        {
            console.log(`upload event: ${yellow(attributes.objectId)}`);

            const bucketUrl:string=attributes.objectId;

            // local cache of handled image names for some optimisation
            if (handledImages.has(bucketUrl))
            {
                console.log(red("  already handled"));
                msg.ack();
                return;
            }

            // add to local cache of handled image names
            handledImages.add(bucketUrl);

            // determine thumbnail url
            const bucketThumbnailUrl:string=normalize(replaceExt(bucketUrl,".jpg"));

            // checking thumbnail bucket for item
            const [thumbnailfiles]=await thumbnailBucket.getFiles({
                prefix:bucketThumbnailUrl
            });

            if (thumbnailfiles.length)
            {
                console.log(red("  thumbnail already exists"));
                msg.ack();
                return;
            }

            // download the file that was uploaded
            const [files]=await imageBucket.getFiles({
                prefix:attributes.objectId
            });

            // should only have exactly one file (the file that was uploaded)
            if (files.length>1)
            {
                console.error("got multiple matches while attempting to download file");
            }

            else if (!files.length)
            {
                console.error("unable to find uploaded file");
            }

            else
            {
                const thefile:File=files[0];
                const filename:string=basename(thefile.name);

                const downloadedImagePath:string=normalize(join(_tmpImageDownloadDir,filename));
                const thumbnailImagePath:string=normalize(join(
                    _tmpGeneratedThumbnailsDir,
                    replaceExt(filename,".jpg")
                ));

                console.log(`  ${blue("downloading:")} ${yellow(downloadedImagePath)}`);

                await thefile.download({
                    destination:downloadedImagePath
                });

                console.log(`  ${green("generating:")} ${yellow(thumbnailImagePath)}`);
                await generateSingleThumbnail(downloadedImagePath,thumbnailImagePath);

                console.log(`  ${magenta("uploading:")} ${yellow(bucketThumbnailUrl)}`);
                await thumbnailBucket.upload(thumbnailImagePath,{
                    destination:bucketThumbnailUrl
                });
            }
        }

        msg.ack();
    });

    console.log(green("watching for storage events..."));
}

main();