import React,{useEffect} from "react";

import "./album-menu-button.less";

interface AMButtonProps
{
  onClick?():void
}

export default function AMButton(props:AMButtonProps):JSX.Element
{
  return <div className="album-menu-button" title="Select Random" onClick={props.onClick}>
    <img className="hovered" src="/assets/imgs/shuffle-pink.png"/>
    <img className="normal" src="/assets/imgs/shuffle-white.png"/>
  </div>;
}