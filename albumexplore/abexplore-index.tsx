import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";

import AlbumTile from "./components/album-tile/albumtile";

import "./abexplore-index.less";

interface AbExploreState
{
  albumItems:AlbumInfo[]
}

class AbExploreMain extends React.Component
{
  state:AbExploreState

  constructor(props:any)
  {
    super(props);

    this.state={
      albumItems:[]
    };
  }

  async componentDidMount()
  {
    this.setState({
      albumItems:await getAlbumInfo("013_hamasuke/bache1")
    });
  }

  render()
  {
    return <>
      <div className="tiles">
        {_.map(this.state.albumItems,(x:AlbumInfo)=>{
          return <AlbumTile key={x.title} img={x.img} date={x.date}
            items={x.items} title={x.title} link="/viewer/deadflow"/>
        })}
      </div>
    </>;
  }
}

// get album info for a path
async function getAlbumInfo(target:string):Promise<AlbumInfo[]>
{
  return (await fetch("/get-album-info",{
    method:"POST",
    body:target
  })).json();
}

function main()
{
  ReactDOM.render(<AbExploreMain/>,document.querySelector(".main"));
}

window.onload=main;