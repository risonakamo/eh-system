import React from "react";

import "./sasbutton.less";

interface SasButtonProps
{
  href:string
  className:string
}

export default class SasButton extends React.Component
{
  props:SasButtonProps

  render()
  {
    return <a className={`sas-icon ${this.props.className}`} href={this.props.href}>
      <img className="pink" src="/assets/imgs/icon-pink.png"/>
      <img className="white" src="/assets/imgs/icon-white.png"/>
    </a>;
  }
}