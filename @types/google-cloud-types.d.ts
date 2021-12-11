/** images from cloud bucket keyed by dir name path */
type ImageDataDirs=Record<string,string[]>

/** image data from cloud in flat directory form. each key will be the full path in the bucket
 *  representing a folder in the bucket. contents of the key will be the files in the bucket */
type ImageDataFlatDir=Record<string,CloudImageData[]>

interface CloudImageData
{
    // cloud path in the bucket including filename
    cloudpath:string

    // cloud path without filename
    folderPath:string

    url:string
}