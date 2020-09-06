import React from "react";
import _ from "lodash";

import AlbumTile from "./components/album-tile/albumtile";
import AlbumToast from "./components/album-toast/albumtoast";

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
    var targetpath:string=this.props.match.params.targetpath || "";

    return <>
      <AlbumToast targetPath={targetpath}/>
      <div className="tiles">
        {_.map(this.state.albumItems,(x:AlbumInfo)=>{
          return createAlbumTile(x,targetpath);
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

// create an albumtile for an album info. give it the current path, with no slash at the begining
function createAlbumTile(info:AlbumInfo,currentPath:string):JSX.Element
{
  var linkPath:string;
  if (!info.album)
  {
    if (currentPath.length)
    {
      linkPath=`/${currentPath}/${info.title}`;
    }

    else
    {
      linkPath=`/${info.title}`;
    }
  }

  else
  {
    if (currentPath.length)
    {
      linkPath=`/viewer/${currentPath}/${info.title}`;
    }

    else
    {
      linkPath=`/viewer/${info.title}`;
    }
  }

  return <AlbumTile key={info.title} img={info.img} date={info.date}
    items={info.items} title={info.title} realLink={info.album} link={linkPath}
    subitems={info.immediateItems}/>;
}