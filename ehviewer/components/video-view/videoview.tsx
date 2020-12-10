import React,{useEffect,useRef} from "react";

import "./videoview.less";

interface VideoViewProps
{
  //target to try to render. can be a non-video, if it is a non video, the whole element does not render.
  src?:string
}

export default function VideoView(props:VideoViewProps):JSX.Element|null
{
  // the last src
  const lastVid=useRef<string|undefined>();

  const vidElement=useRef<HTMLVideoElement>(null);

  // video reload effect, attempt video reload if src has changed.
  useEffect(()=>{
    if (lastVid.current!=props.src)
    {
      vidElement.current?.load();
    }

    lastVid.current=props.src;
  });

  if (!props.src || !isVideo(props.src))
  {
    return null;
  }

  return <div className="video-zone">
    <video muted controls autoPlay loop ref={vidElement}>
      <source src={props.src}/>
    </video>
  </div>
}

/**determine if a link is a link to a video and not an image*/
export function isVideo(link:string):boolean
{
  return /\.mp4|\.webm/.test(link);
}