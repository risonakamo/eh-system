import replaceExt from "replace-ext";
import {PubSub,Subscription,Message} from "@google-cloud/pubsub";
import {Storage,Bucket,File} from "@google-cloud/storage";
import {yellow,green} from "chalk";
import {basename} from "path";
import {join} from "path";
import normalize from "normalize-path";
import {ensureDirSync} from "fs-extra";

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

    subscription.on("message",async (msg:Message)=>{
        const attributes:CloudStoragePubSubMessageAttributes=(
            msg.attributes as any as CloudStoragePubSubMessageAttributes
        );

        if (attributes.eventType=="OBJECT_FINALIZE")
        {
            console.log(`upload event: ${yellow(attributes.objectId)}`);

            const bucketUrl:string=attributes.objectId;
            const bucketThumbnailUrl:string=replaceExt(bucketUrl,".jpg");

            // checking thumbnail bucket for item
            const [files]=await thumbnailBucket.getFiles({
                prefix:attributes.objectId //todo: this needs to be modified to be thumbnail file extension
            });

            if (files.length)
            {
                console.log("thumbnail already exists");
            }

            else
            {
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
                        _thumbnailBucketName,
                        replaceExt(filename,".jpg")
                    ));

                    console.log(`  downloading: ${downloadedImagePath}`);

                    await thefile.download({
                        destination:downloadedImagePath
                    });
                }
            }
        }

        msg.ack();
    });

    console.log(green("watching for storage events..."));
}

main();