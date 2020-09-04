import React from "react";

import "./albumtile.less";

export default class AlbumTile extends React.Component
{
  render()
  {
    return <div className="album-tile">
      <div className="title float-label">randomboobguy</div>
      <div className="item-count float-label">23</div>
      <img src="/thumbnaildata/deadflow/neflim/05.jpg"/>
    </div>;
  }
}