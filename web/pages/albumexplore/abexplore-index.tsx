import React,{useState,useEffect,useRef} from "react";
import _ from "lodash";

import AlbumTile from "components/album-tile/albumtile";
import AlbumMenu from "components/album-menu/album-menu";

import "css/abexplore-index.less";

interface AbExploreProps
{
  // router match provides path
  match:{
    params:{
      targetpath:string|null
    }
  }

  history:RouterHistory
}

export default function AbExploreMain(props:AbExploreProps):JSX.Element
{
  const [theAlbumItems,setAlbumItems]=useState<AlbumInfo[]>([]);

  const prevTargetPath=useRef<string>("");

  // navigate to / on startup
  useEffect(()=>{
    changeTargetPath(props.match.params.targetpath || "");
  },[]);

  // call change target path on target path change
  useEffect(()=>{
    if (prevTargetPath.current!=props.match.params.targetpath)
    {
      changeTargetPath(props.match.params.targetpath || "");
    }
  },[props.match.params.targetpath]);

  /** ---- MEMBERS ---- */
  // navigate ab explore to a new target
  async function changeTargetPath(target:string):Promise<void>
  {
    setAlbumItems(await getAlbumInfo(target));
  }

  /** navigate to a random album from the albums currently showing */
  function navigateToRandom(newTab:boolean=false):void
  {
    // need to construct an absolute path to the path we would like to go to.
    var selectedItem:AlbumInfo=_.sample(theAlbumItems)!;
    var title:string=selectedItem.title;
    var currentPath:string|null=props.match.params.targetpath;
    var navPath:string;

    // attempt to join the current path and the new target. add a slash at the beginning
    // to make it absolute
    if (currentPath)
    {
      navPath=[
        "/",
        currentPath,
        title
      ].join("/");
    }

    // otherwise, if we are at the beginning (no currentpath), just add a slash
    else
    {
      navPath="/"+title;
    }

    // sometimes the slash gets duplicated, fix it.
    navPath=navPath.replace("//","/");

    // if not opening a new tab
    if (!newTab)
    {
      if (selectedItem.album)
      {
        hardNavigate("/viewer"+navPath);
      }

      // not an album
      else
      {
        props.history.push(navPath);
        changeTargetPath(navPath);
      }
    }

    // navigating to random in new tab
    else
    {
      // add viewer for album
      if (selectedItem.album)
      {
        navPath="/viewer"+navPath;
      }

      else
      {
        navPath="/albums"+navPath;
      }

      // spawn new tab
      window.open(window.location.origin+navPath,"_blank");
    }
  }

  /** navigate to random in new tab */
  function navigateToRandomNewTab():void
  {
    navigateToRandom(true);
  }

  /* navigate to viewer page for the current album url. does not work if at top level */
  function openCurrentAlbum():void
  {
    if (!props.match.params.targetpath)
    {
      return;
    }

    hardNavigate("/viewer/"+props.match.params.targetpath);
  }

  /** push history and page navigate to url */
  function hardNavigate(url:string):void
  {
    props.history.push(".");
    window.location.replace(url);
  }


  /** ---- RENDER ---- */
  var targetpath:string=props.match.params.targetpath || "";

  return <>
    <AlbumMenu targetPath={targetpath} navigateRandom={navigateToRandom}
      navigateCurrent={openCurrentAlbum} navigateRandomNewTab={navigateToRandomNewTab}/>
    <div className="tiles">
      {_.map(theAlbumItems,(x:AlbumInfo)=>{
        return createAlbumTile(x,targetpath);
      })}
    </div>
  </>;
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
  var subPath:string;

  // set the subpath, which is the path to the viewer
  if (currentPath.length)
  {
    subPath=`/viewer/${currentPath}/${info.title}`;
  }

  else
  {
    subPath=`/viewer/${info.title}`;
  }

  // set the link path, which either leads to the album or opens the viewer
  // if the item is an actual album
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
    linkPath=subPath;
  }

  return <AlbumTile key={info.title} img={info.img} date={info.date}
    items={info.items} title={info.title} realLink={info.album} link={linkPath}
    subitems={info.immediateItems} sublink={subPath}/>;
}