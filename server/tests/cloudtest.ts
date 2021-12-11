import {Storage} from "@google-cloud/storage";

import {getCloudImageData,getCloudImageDataDict,
    getImmediateDirNames} from "../lib/googlecloud/cloud-imagedata";

async function main()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket=storage.bucket("ktkm-albumviewer-images");

    console.log(await getCloudImageData("numbvers",bucket));
}

async function main2()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket=storage.bucket("ktkm-albumviewer-images");

    const dictdata:ImageDataDirs=await getCloudImageDataDict("",bucket);

    console.log(dictdata);

    console.log("immediates",getImmediateDirNames("",dictdata));
}

// main();
main2();