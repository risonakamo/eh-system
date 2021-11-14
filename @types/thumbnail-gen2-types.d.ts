interface TargetItem
{
    basepath:string // given original absolute base path
    fullpath:string // absolute full true path to the item

    filepath:string // relative path from the original basepath
    filename:string // without extension
}

interface ThumbnailTargetItem
{
    originalpath:string // absolute to target image
    thumbnailpath:string // absolute path that should be the thumbnail output for the target
}