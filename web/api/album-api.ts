// api functions for accessing eh-viewer server backend

/** retrieve images from a specified album path */
export async function requestAlbum(path:string):Promise<AlbumResponse>
{
  return (await fetch("/get-album",{
    method:"POST",
    body:path
  })).json();
}

/** get album info for a path */
export async function getAlbumInfo(target:string):Promise<AlbumInfo[]>
{
  return (await fetch("/get-album-info",{
    method:"POST",
    body:target
  })).json();
}