import React from "react";
import _ from "lodash";

interface PreviewPanelProps
{
  imgs:ImageObject[] // array of image objects
  currentImageIndex:number // index of the current image in the imgs array
  showing:boolean // show the preview panel or not
  navigateImage(imgIndex:number):void // parent function to call to navigate to a image index
}

class PreviewPanel extends React.PureComponent
{
  props:PreviewPanelProps

  render()
  {
    var thumbnails=_.map(this.props.imgs,(x:ImageObject,i:number)=>{
      var selected=this.props.currentImageIndex==i?true:false;

      return <PreviewThumbnail thumbnailurl={convertThumbnail(x.link)}
        key={i} selected={selected} indexNumber={i} navigateImage={this.props.navigateImage}/>;
    });

    return <div className={`preview-panel ${this.props.showing?"":"hidden"}`}>
      {thumbnails}
    </div>;
  }
}