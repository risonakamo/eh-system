import {load} from "js-yaml";
import {readFileSync} from "fs";
import {join} from "path";

/** get server config from default location. config must be in config folder of this repo and be named
 *  config.yml */
export function getServerConfig():ServerConfig
{
    return load(readFileSync(join(__dirname,"../config/config.yml"),"utf8")) as ServerConfig;
}