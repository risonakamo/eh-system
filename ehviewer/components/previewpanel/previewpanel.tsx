import React from "react";
import _ from "lodash";

import PreviewThumbnail from "./previewthumbnail";
import SasButton from "../sas-button/sasbutton";

import "./previewpanel.less";

interface PreviewPanelProps
{
  thumbnails:string[] // array of image objects
  currentImageIndex:number // index of the current image in the imgs array
  showing:boolean // show the preview panel or not
  navigateImage(imgIndex:number):void // parent function to call to navigate to a image index
  togglePanelShowing():void //function to close the panel
}

export default class PreviewPanel extends React.PureComponent
{
  props:PreviewPanelProps

  render()
  {
    var thumbnails=_.map(this.props.thumbnails,(x:string,i:number)=>{
      var selected=this.props.currentImageIndex==i?true:false;

      return <PreviewThumbnail thumbnailurl={x} key={i} selected={selected}
        indexNumber={i} navigateImage={this.props.navigateImage}
        togglePanelShowing={this.props.togglePanelShowing}/>;
    });

    return <div className={`preview-panel ${this.props.showing?"":"hidden"}`}>
      <div className="header">
        <SasButton href="/" className="home-icon"/>
      </div>
      {thumbnails}
    </div>;
  }
}