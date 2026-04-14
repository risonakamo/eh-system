import React,{useRef,useEffect} from "react";
import _ from "lodash";

import AMButton from "components/album-menu-button/album-menu-button";
import PreviewThumbnail,{PreviewThumbnailRef} from "./previewthumbnail";

import "./previewpanel.less";

interface PreviewPanelProps
{
  thumbnails:string[] // array of image objects
  currentImageIndex:number // index of the current image in the imgs array
  showing:boolean // show the preview panel or not
  navigateImage(imgIndex:number):void // parent function to call to navigate to a image index
  togglePanelShowing():void //function to close the panel
}

export default function PreviewPanel(props:PreviewPanelProps):JSX.Element
{
  const selectedThumbnail=useRef<PreviewThumbnailRef|null>(null);

  // on opening panel, scroll into view the selected thumbnail
  useEffect(()=>{
    if (props.showing)
    {
      selectedThumbnail.current?.scrollIntoView();
    }
  },[props.showing]);

  /** try to go back to album page */
  function goBackToAlbumPage():void
  {
    const currentUrl=new URL(window.location.href);
    currentUrl.pathname=currentUrl.pathname.replace(/^\/viewer\//, "/albums/");
    window.location.href=currentUrl.pathname;
  }

  /** --- RENDER --- */
  const thumbnails:JSX.Element[]=_.map(props.thumbnails,(x:string,i:number)=>{
    const selected:boolean=props.currentImageIndex==i;

    // save the selected thumbnail ref
    function saveSelectedThumbnail(ref:PreviewThumbnailRef):void
    {
      if (selected)
      {
        selectedThumbnail.current=ref;
      }
    }

    return <PreviewThumbnail thumbnailurl={x} key={i} selected={selected}
      indexNumber={i} navigateImage={props.navigateImage} ref={saveSelectedThumbnail}
      togglePanelShowing={props.togglePanelShowing}/>;
  });

  return <div className={`preview-panel ${props.showing?"":"hidden"}`}>
    <div className="header">
      <AMButton onClick={goBackToAlbumPage} title="Back to Album Page"
        normalIcon="/assets/imgs/icon-white.png" hoverIcon="/assets/imgs/icon-pink.png"/>
    </div>
    {thumbnails}
  </div>;
}