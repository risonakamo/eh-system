import React from "react";

interface PreviewThumbnailProps
{
  thumbnailurl:string // the url of the thumbnail to display, needs to already be a
                      // valid thumbail url that is the correct size
  selected:boolean // whether the thumbnail should show as selected
  indexNumber:number // the index number of this thumbnail
  navigateImage(imgIndex:number):void // parent function to call to navigate to a image index
  togglePanelShowing():void
}

export default class PreviewThumbnail extends React.Component
{
  props:PreviewThumbnailProps

  constructor(props:PreviewThumbnailProps)
  {
    super(props);
    this.navigateAction=this.navigateAction.bind(this);
    this.closePanelAction=this.closePanelAction.bind(this);
  }

  // click action, use navigate image
  navigateAction()
  {
    this.props.navigateImage(this.props.indexNumber);
  }

  closePanelAction()
  {
    this.props.togglePanelShowing();
  }

  render()
  {
    return <a className={`thumbnail ${this.props.selected?"selected":""}`} onClick={this.navigateAction}
      onDoubleClick={this.closePanelAction}>
      <img src={this.props.thumbnailurl}/>
      <div className="select-border"></div>
    </a>;
  }
}