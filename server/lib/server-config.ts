import {load} from "js-yaml";
import {readFileSync} from "fs";
import {join,resolve} from "path";

/** get server config from default location. config must be in config folder of this repo and be named
 *  config.yml. all paths will be made absolute */
export function getServerConfig():ServerConfig
{
    var config:ServerConfig=load(
        readFileSync(join(__dirname,"../../config/config.yml"),"utf8")
    ) as ServerConfig;

    config.imagedir=resolve(config.imagedir);
    config.thumbnaildir=resolve(config.thumbnaildir);

    return config;
}