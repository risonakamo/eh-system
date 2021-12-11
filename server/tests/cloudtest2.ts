import {Bucket,Storage} from "@google-cloud/storage";

import {getCloudImageDataFlatDir} from "../lib/googlecloud/cloud-imagedata2";
import {toSubDirForm} from "../lib/googlecloud/cloud-subdirform";

/** test getting imagedata in flat dir form */
async function test1()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket:Bucket=storage.bucket("ktkm-albumviewer-images");

    const imagedata:ImageDataFlatDir=await getCloudImageDataFlatDir("stuff/",bucket);
    console.log(imagedata);
}

/** test subdir form conversion */
async function test2()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket:Bucket=storage.bucket("ktkm-albumviewer-images");

    const targetpath:string="stuff";
    const imagedata:ImageDataFlatDir=await getCloudImageDataFlatDir(targetpath,bucket);

    const subdirform:ImageDataSubDir=toSubDirForm(imagedata,targetpath);
    console.dir(subdirform,{depth:null});
}

// test1();
test2();