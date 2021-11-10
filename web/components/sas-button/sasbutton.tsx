import React from "react";
import {Link} from "react-router-dom";

import "./sasbutton.less";

interface SasButtonProps
{
  href:string
  className?:string
  routerLink?:boolean
}

export default function SasButton(props:SasButtonProps):JSX.Element
{
  var className:string=props.className || "";

  var innerContent:JsxElement=<>
    <img className="pink" src="/assets/imgs/icon-pink.png"/>
    <img className="white" src="/assets/imgs/icon-white.png"/>
  </>;

  if (props.routerLink)
  {
    return <Link to={props.href} className={`sas-icon ${className}`}>
      {innerContent}
    </Link>;
  }

  return <a className={`sas-icon ${className}`} href={props.href}>
    {innerContent}
  </a>;
}