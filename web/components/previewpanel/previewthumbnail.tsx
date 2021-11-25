import React,{useRef,useImperativeHandle,forwardRef} from "react";

interface PreviewThumbnailProps
{
  thumbnailurl:string // the url of the thumbnail to display, needs to already be a
                      // valid thumbail url that is the correct size
  selected:boolean // whether the thumbnail should show as selected
  indexNumber:number // the index number of this thumbnail
  navigateImage(imgIndex:number):void // parent function to call to navigate to a image index
  togglePanelShowing():void
}

export interface PreviewThumbnailRef
{
  scrollIntoView():void
}

export default forwardRef(PreviewThumbnail);
function PreviewThumbnail(
  props:PreviewThumbnailProps,
  ref:React.Ref<PreviewThumbnailRef>
):JSX.Element
{
  const theElement=useRef<HTMLAnchorElement>(null);

  useImperativeHandle(ref,()=>({
    scrollIntoView
  }));

  /** scroll this thumbnail element into view */
  function scrollIntoView():void
  {
    theElement.current?.scrollIntoView({
      block:"center"
    });
  }

  // click action, use navigate image
  function navigateAction():void
  {
    props.navigateImage(props.indexNumber);
  }

  function closePanelAction():void
  {
    props.togglePanelShowing();
  }

  return <a className={`thumbnail ${props.selected?"selected":""}`} onClick={navigateAction}
    onDoubleClick={closePanelAction} ref={theElement}>
    <img src={props.thumbnailurl}/>
    <div className="select-border"></div>
  </a>;
}