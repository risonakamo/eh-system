import React from "react";
import {Link} from "react-router-dom";

import "./sasbutton.less";

interface SasButtonProps
{
  href:string
  className?:string
  routerLink?:boolean
}

export default class SasButton extends React.Component
{
  props:SasButtonProps

  render()
  {
    var className:string=this.props.className || "";

    var innerContent:JsxElement=<>
      <img className="pink" src="/assets/imgs/icon-pink.png"/>
      <img className="white" src="/assets/imgs/icon-white.png"/>
    </>;

    if (this.props.routerLink)
    {
      return <Link to={this.props.href} className={`sas-icon ${className}`}>
        {innerContent}
      </Link>;
    }

    return <a className={`sas-icon ${className}`} href={this.props.href}>
      {innerContent}
    </a>;
  }
}