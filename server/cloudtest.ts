import {Storage} from "@google-cloud/storage";

import {getCloudImageData} from "./lib/googlecloud/cloud-imagedata";

async function main()
{
    const storage=new Storage({
        keyFilename:"config/cloudkey.json"
    });

    const bucket=storage.bucket("ktkm-albumviewer-images");

    console.log(await getCloudImageData("numbvers",bucket));
}

main();