/** images from cloud bucket keyed by dir name path */
type ImageDataDirs=Record<string,string[]>

/** image data from cloud in flat directory form. each key will be the full path in the bucket
 *  representing a folder in the bucket. contents of the key will be the files in the bucket */
type ImageDataFlatDir=Record<string,CloudImageData[]>

/** image data flat dir organised by subdir. a subdir is a dir relative to some target path, that is,
 *  all sub dirs in this object will be of a folder that exists directly below some target path when this
 *  object is generated */
type ImageDataSubDir=Record<string,ImageDataFlatDir>

type CloudStoragePubSubEventType="OBJECT_FINALIZE"

interface CloudImageData
{
    // cloud path in the bucket including filename
    cloudpath:string

    // cloud path without filename
    folderPath:string

    url:string
}

interface CloudStoragePubSubMessageAttributes
{
    eventType:CloudStoragePubSubEventType
    objectId:string
    bucketId:string
}