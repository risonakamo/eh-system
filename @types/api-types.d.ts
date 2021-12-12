type ApiMode="cloud"|"local"

/** response containing album image urls */
interface AlbumResponse
{
    urls:string[]
    mode:ApiMode
}

/** cloud album response */
interface AlbumResponseCloud extends AlbumResponse
{
    mode:"cloud"

    cloudInfo:CloudModeConfiguration
}

interface CloudModeConfiguration
{
    mainUrl:string
    thumbnailUrl:string
}