type ServerCliArgsMeow=import("meow").Result<ServerCliArgsInner>

interface ServerCliArgs
{
    configLocation:string
}

interface ServerCliArgsInner
{
    config:{
        type:"string"
        default:string
    }
}