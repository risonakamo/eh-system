import React,{useLayoutEffect,useRef,useState} from "react";
import cx from "classnames";

import "./status-indicator.less";

interface StatusIndicatorProps
{
  text:string
}

export default function StatusIndicator(props:StatusIndicatorProps):JSX.Element
{
  const theElement=useRef<HTMLDivElement>(null);

  const [fadingOut,setFadingOut]=useState<boolean>(false);

  const fadingOutTimer=useRef<ReturnType<typeof setTimeout>>();

  // trigger fade out on text change
  useLayoutEffect(()=>{
    if (fadingOutTimer.current)
    {
      clearTimeout(fadingOutTimer.current);
    }

    setFadingOut(false);

    fadingOutTimer.current=setTimeout(()=>{
      setFadingOut(true);
    },10);
  },[props.text]);

  const topClass={
    "fade-out":fadingOut
  };

  return <div className={cx("status-indicator",topClass)} ref={theElement}>
    {props.text}
  </div>;
}