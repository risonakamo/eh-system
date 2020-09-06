import React from "react";
import {Link} from "react-router-dom";

import "./albumtile.less";

interface AlbumTileProps
{
  img:string
  date:string
  items:number
  subitems:number
  title:string
  link:string
  realLink?:boolean
}

export default class AlbumTile extends React.Component
{
  props:AlbumTileProps

  render()
  {
    var displaySubitems:string=this.props.items==this.props.subitems?"none":"";

    var innerContent=<>
      <div className="title float-label">{this.props.title}</div>
      <div className="main-count item-count float-label">{this.props.items}</div>
      <div className="sub-count item-count float-label"
        style={{display:displaySubitems}}>{this.props.subitems}</div>
      <div className="date float-label">{this.props.date}</div>
      <img src={this.props.img}/>
    </>;

    if (!this.props.realLink)
    {
      return <Link className="album-tile" to={this.props.link}>
        {innerContent}
      </Link>;
    }

    return <a className="album-tile" href={this.props.link}>
      {innerContent}
    </a>;
  }
}