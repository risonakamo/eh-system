import {Storage} from "@google-cloud/storage";

import {getCloudImageData,getCloudImageDataDict,getImmediateDirs} from "./lib/googlecloud/cloud-imagedata";

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

    const dictdata:ImageDataDirs=await getCloudImageDataDict("stuff",bucket);

    console.log(dictdata);

    console.log("immediates",getImmediateDirs("stuff/dark",dictdata));
}

// main();
main2();