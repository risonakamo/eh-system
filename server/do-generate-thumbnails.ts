import {generatedNeededThumbnails} from "./lib/thumbnail-gen2/thumbnail-gen";
import {getServerConfig} from "./lib/server-config";
import {getServerArgs} from "./lib/cli";

/** read in server config to get image folder/thumbnail folder locations, performs generation as needed. */
function main()
{
    const serverArgs:ServerCliArgs=getServerArgs();
    const config:ServerConfig=getServerConfig(serverArgs.configLocation);
    generatedNeededThumbnails(config.imagedir,config.thumbnaildir);
}

main();