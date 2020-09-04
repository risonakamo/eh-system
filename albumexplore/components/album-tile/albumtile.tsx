import React from "react";

import "./albumtile.less";

export default class AlbumTile extends React.Component
{
  render()
  {
    return <div className="album-tile">
      <div className="title">randomboobguy</div>
      <img src="/thumbnaildata/deadflow/neflim/05.jpg"/>
    </div>;
  }
}