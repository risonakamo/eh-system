import React from "react";

import "./album-menu-button.less";

export default function AMButton():JSX.Element
{
  return <div className="album-menu-button" title="Select Random">
    <img className="hovered" src="/assets/imgs/shuffle-pink.png"/>
    <img className="normal" src="/assets/imgs/shuffle-white.png"/>
  </div>;
}