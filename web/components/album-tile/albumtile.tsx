import React from "react";
import {Link} from "react-router-dom";

import valueToColourConfig from "lib/count-colour-resolvers";

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

export default function AlbumTile(props:AlbumTileProps):JSX.Element
{
  var linkElement:JsxElement;
  if (!props.realLink)
  {
    linkElement=<Link to={props.link}><img src={props.img}/></Link>;
  }

  else
  {
    linkElement=<a href={props.link}><img src={props.img}/></a>;
  }

  var mainItemCountStyle=valueToColourConfig(props.items,100);
  var subItemCountStyle={
    display:props.realLink?"none":"",
    ...valueToColourConfig(props.subitems,20)
  };

  return <div className="album-tile">
    <div className="title float-label">{props.title}</div>
    <div className="count-holder">
      <a className="main-count item-count float-label" href={props.sublink}
        style={mainItemCountStyle}>{props.items}</a>
      <a className="sub-count item-count float-label" href={props.sublink}
        style={subItemCountStyle}>{props.subitems}</a>
    </div>
    <div className="date float-label">{props.date}</div>
    {linkElement}
  </div>;
}