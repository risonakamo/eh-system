import _ from "lodash";
import {Bucket,Storage} from "@google-cloud/storage";

import {getCloudImageDataFlatDir} from "../lib/googlecloud/cloud-imagedata2";
import {toSubDirForm} from "../lib/googlecloud/cloud-subdirform";
import {getCloudAlbumInfo} from "../lib/googlecloud/cloud-albuminfo2";

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

/** test recursive subdir form */
async function test3()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket:Bucket=storage.bucket("ktkm-albumviewer-images");

    const targetpath:string="stuff";
    const targetsubdir:string="stuff/light";

    const imagedata:ImageDataFlatDir=await getCloudImageDataFlatDir(targetpath,bucket);

    const subdirform:ImageDataSubDir=toSubDirForm(imagedata,targetpath);
    console.log(_.keys(subdirform));

    const subdirform2:ImageDataSubDir=toSubDirForm(subdirform[targetsubdir],targetsubdir);
    console.dir(subdirform2,{depth:null});
}

/** test cloud album info */
async function test4()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket:Bucket=storage.bucket("ktkm-albumviewer-images");

    const info:AlbumInfo[]=await getCloudAlbumInfo("",bucket);
    console.log(info);
}

// test1();
// test2();
// test3();
test4();