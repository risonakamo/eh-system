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
    items:number //total items in the album, including sublevels
    immediateItems:number //items immediately in the album
    img:string //random cover image url
    date:string //last date album was edited
    album:boolean //whether it is an actual album, a folder containing only images
}

interface ItemCountColour
{
    color:string
    backgroundColor:string
}