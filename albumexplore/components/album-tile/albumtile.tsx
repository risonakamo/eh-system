import React from "react";
import {Link} from "react-router-dom";

import "./albumtile.less";

interface AlbumTileProps
{
  img:string
  date:string
  items:number
  title:string
  link:string
}

export default class AlbumTile extends React.Component
{
  props:AlbumTileProps

  render()
  {
    return <Link className="album-tile" to={this.props.link}>
      <div className="title float-label">{this.props.title}</div>
      <div className="item-count float-label">{this.props.items}</div>
      <div className="date float-label">{this.props.date}</div>
      <img src={this.props.img}/>
    </Link>;
  }
}