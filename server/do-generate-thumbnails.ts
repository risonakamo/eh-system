import {generatedNeededThumbnails} from "./lib/thumbnail-gen2/thumbnail-gen";
import {getServerConfig} from "./lib/server-config";

/** read in server config to get image folder/thumbnail folder locations, performs generation as needed. */
function main()
{
    const config:ServerConfig=getServerConfig();
    generatedNeededThumbnails(config.imagedir,config.thumbnaildir);
}

main();