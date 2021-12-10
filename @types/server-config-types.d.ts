interface ServerConfig
{
    imagedir:string
    thumbnaildir:string

    google_cloud_config:{
        enabled:boolean
        mainimage_bucket:string
    }

    port:number
    static_serve:boolean
    thumbnail_gen_batch:number
}