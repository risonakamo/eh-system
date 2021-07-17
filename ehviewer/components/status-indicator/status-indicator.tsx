import React,{useEffect,useRef} from "react";

import "./status-indicator.less";

interface StatusIndicatorProps
{
  text:string
}

export default function StatusIndicator(props:StatusIndicatorProps):JSX.Element
{
  const theElement=useRef<HTMLDivElement>(null);

  // trigger fade out on text change
  useEffect(()=>{

  },[props.text]);

  return <div className="status-indicator" ref={theElement}>
    {props.text}
  </div>;
}