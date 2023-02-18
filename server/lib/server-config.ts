import {load} from "js-yaml";
import {readFileSync} from "fs";
import {join,resolve} from "path";

/** get server config from some location. */
export function getServerConfig(configPath:string):ServerConfig
{
    var config:ServerConfig=load(
        readFileSync(configPath,"utf8")
    ) as ServerConfig;

    config.imagedir=resolve(config.imagedir);
    config.thumbnaildir=resolve(config.thumbnaildir);

    return config;
}