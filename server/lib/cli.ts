import meow from "meow";
import {join,resolve} from "path";
import normalize from "normalize-path";

/** get server args from command line. default is relative to this file */
export function getServerArgs():ServerCliArgs
{
    const args:ServerCliArgsMeow=meow(`
        server [flags]

        flags:
        --config <path>: path to config file
    `,{
        flags:{
            config:{
                type:"string",
                default:join(__dirname,"../../config/config.yml")
            }
        }
    });

    return {
        configLocation:normalize(resolve(args.flags.config))
    };
}