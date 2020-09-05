interface ImageObject
{
    top?:number
    left?:number
    zoom?:number
    link:string
}

interface AlbumInfo
{
    title:string //title of album
    items:number //items in the album
    img:string //random cover image url
    date:string //last date album was edited
    album:boolean //whether it is an actual album, a folder containing only images
}