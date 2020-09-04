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
        <AlbumTile/>
      </div>
    </>;
  }
}

function main()
{
  ReactDOM.render(<AbExploreMain/>,document.querySelector(".main"));
}

window.onload=main;