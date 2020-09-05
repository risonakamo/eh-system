import React from "react";
import _ from "lodash";

import AlbumTile from "./components/album-tile/albumtile";

import "./abexplore-index.less";

interface AbExploreProps
{
  // router match provides path
  match:{
    params:{
      targetpath:string|null
    }
  }
}

interface AbExploreState
{
  albumItems:AlbumInfo[]
}

export default class AbExploreMain extends React.Component
{
  props:AbExploreProps
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
      albumItems:await getAlbumInfo(this.props.match.params.targetpath || "")
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