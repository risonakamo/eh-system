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
    this.changeTargetPath(this.props.match.params.targetpath || "");
  }

  componentDidUpdate(prevProps:AbExploreProps)
  {
    if (prevProps.match.params.targetpath!=this.props.match.params.targetpath)
    {
      this.changeTargetPath(this.props.match.params.targetpath || "");
    }
  }

  // navigate ab explore to a new target
  async changeTargetPath(target:string):Promise<void>
  {
    this.setState({
      albumItems:await getAlbumInfo(target)
    });
  }

  render()
  {
    return <>
      <div className="tiles">
        {_.map(this.state.albumItems,(x:AlbumInfo)=>{
          var link:string;
          if (!x.album)
          {
            link=x.title;
          }

          else
          {
            var targetPath:string=this.props.match.params.targetpath || "";
            if (targetPath.length)
            {
              targetPath+="/";
            }

            link=`/viewer/${targetPath}${x.title}`;
          }

          return <AlbumTile key={x.title} img={x.img} date={x.date}
            items={x.items} title={x.title} link={link} realLink={x.album}/>
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