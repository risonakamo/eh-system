import React from "react";
import ReactDOM from "react-dom";

import AlbumTile from "./components/album-tile/albumtile";

import "./abexplore-index.less";

class AbExploreMain extends React.Component
{
  render()
  {
    return <>
      <div className="tiles">
        <AlbumTile img="/thumbnaildata/deadflow/neflim/05.jpg" date="20/02/01"
          items={23} title="deadflow" link="/viewer/deadflow"/>
        <AlbumTile img="/thumbnaildata/013_hamasuke/bache1/4.png" date="20/03/22"
          items={10} title="bache1" link="/viewer/013_hamasuke/bache1"/>
      </div>
    </>;
  }
}

function main()
{
  ReactDOM.render(<AbExploreMain/>,document.querySelector(".main"));
}

window.onload=main;