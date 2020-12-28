import React from "react";
import cx from "classnames";

import "./album-menu-button.less";

interface AMButtonProps
{
  onClick?():void
  disabled?:boolean
  title?:string

  normalIcon:string
  hoverIcon:string
}

export default function AMButton(props:AMButtonProps):JSX.Element
{
  /** click handler, disabled when button disabled */
  function clickHandler():void
  {
    if (props.disabled)
    {
      return;
    }

    props.onClick?.();
  }

  const amButtonClass:string=cx(
    "album-menu-button",
    {"disabled":props.disabled}
  );

  return <div className={amButtonClass} title={props.title} onClick={clickHandler}>
    <img className="hovered" src={props.hoverIcon}/>
    <img className="normal" src={props.normalIcon}/>
  </div>;
}