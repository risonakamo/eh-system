import {Storage,Bucket} from "@google-cloud/storage";
import {PubSub,Subscription,Message} from "@google-cloud/pubsub";
import {writeFileSync} from "fs";

/** test creating notification on bucket? */
async function main()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket:Bucket=storage.bucket("ktkm-albumviewer-images");

    const res=await bucket.createNotification("imagebucket-events");
    console.log(res);
}

/** subscribe to subscription on imagebucket event topic */
async function main2()
{
    const pubsub=new PubSub({
        projectId:"cloud-class-albumviewer",
        keyFilename:"config/cloudkey.json"
    });

    const subscription:Subscription=pubsub.subscription("imagebucket-events-sub");

    subscription.on("message",(msg:Message)=>{
        console.log("msg",msg.attributes.eventType,msg.attributes.objectId);
        msg.ack();
    });

    console.log("waiting");
}

// main();
main2();