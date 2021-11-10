import React,{useRef,useEffect} from "react";
import _ from "lodash";

import SasButton from "components/sas-button/sasbutton";
import PreviewThumbnail from "./previewthumbnail";

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
  /** --- RENDER --- */
  var thumbnails=_.map(props.thumbnails,(x:string,i:number)=>{
    var selected=props.currentImageIndex==i?true:false;

    return <PreviewThumbnail thumbnailurl={x} key={i} selected={selected}
      indexNumber={i} navigateImage={props.navigateImage}
      togglePanelShowing={props.togglePanelShowing}/>;
  });

  return <div className={`preview-panel ${props.showing?"":"hidden"}`}>
    <div className="header">
      <SasButton href="/" className="home-icon"/>
    </div>
    {thumbnails}
  </div>;
}