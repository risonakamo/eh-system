import React from "react";
import {Link} from "react-router-dom";

import valueToColourConfig from "./count-colour-resolvers";

import "./albumtile.less";

interface AlbumTileProps
{
  img:string
  date:string
  items:number // main item count
  subitems:number //sub item count
  title:string
  link:string
  sublink:string
  realLink?:boolean
}

export default class AlbumTile extends React.Component
{
  props:AlbumTileProps

  render()
  {
    var linkElement:JsxElement;
    if (!this.props.realLink)
    {
      linkElement=<Link to={this.props.link}><img src={this.props.img}/></Link>;
    }

    else
    {
      linkElement=<a href={this.props.link}><img src={this.props.img}/></a>;
    }

    var mainItemCountStyle=valueToColourConfig(this.props.items,100);
    var subItemCountStyle={
      display:this.props.items==this.props.subitems?"none":"",
      ...valueToColourConfig(this.props.subitems,20)
    };

    return <div className="album-tile">
      <div className="title float-label">{this.props.title}</div>
      <div className="count-holder">
        <a className="main-count item-count float-label" href={this.props.sublink}
          style={mainItemCountStyle}>{this.props.items}</a>
        <a className="sub-count item-count float-label" href={this.props.sublink}
          style={subItemCountStyle}>{this.props.subitems}</a>
      </div>
      <div className="date float-label">{this.props.date}</div>
      {linkElement}
    </div>;
  }
}