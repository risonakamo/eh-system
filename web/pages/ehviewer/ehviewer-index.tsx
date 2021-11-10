import React,{useRef,useState,useEffect} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import _ from "lodash";
import Viewer from "viewerjs";
import cx from "classnames";

import PreviewPanel from "components/previewpanel/previewpanel";
import VideoView,{isVideo} from "components/video-view/videoview";
import StatusIndicator from "components/status-indicator/status-indicator";

import "./ehviewer-index.less";
import "viewerjs/dist/viewer.css";

interface RouterMatch
{
  params:{
    albumpath:string
  }
}

interface EhViewerProps
{
  match:RouterMatch //match from router
}

interface EhViewerState
{
  currentImage:ImageObject|null //the current showing image object

  mouseHidden:boolean //when enabled, mouse is hidden

  panelShowing:boolean

  imgs:ImageObject[] //the images
  currentImageIndex:number //the current image index

  // current status indicator display text
  statusText:string
}

export default function EhViewerMain(props:EhViewerProps):JSX.Element
{
  /** --- STATES --- */
  const [theCurrentImage,setCurrentImage]=useState<ImageObject|null>(null);

  const [mouseHidden,setMouseHidden]=useState<boolean>(false);
  const [panelShowing,setPanelShowing]=useState<boolean>(false);

  const [theImgs,setImgs]=useState<ImageObject[]>([]);
  const [theCurrentImageIndex,setCurrentImageIndex]=useState<number>(0);

  const [theStatusText,setStatusText]=useState<string>("");


  /** --- REFS --- */
  const theViewer=useRef<any>(null);
  const theViewerElement=useRef<HTMLUListElement>(null);

  const imageChangeInProgress=useRef<boolean>(false);
  const justFitHeight=useRef<boolean>(false);
  const hideTimer=useRef<number>(0);

  const thumbnails=useRef<string[]>([]);

  const transitions=useRef<boolean>(false);


  /** --- EFFECTS --- */
  useEffect(()=>{
    (async ()=>{
      theViewer.current=new Viewer(theViewerElement.current as HTMLElement,{
        inline:true,
        title:false,
        keyboard:false,
        button:false,
        zoomRatio:.3,
        backdrop:false,
        transition:transitions.current,
        ready:()=>{
          theViewer.current?.full();
        },
        viewed:()=>{
          imageChangeInProgress.current=false;

          // if the current image has zoom and other custom values set, set the zoom the the values
          if (_.get(theCurrentImage,"zoom"))
          {
            theViewer.current?.zoomTo(theCurrentImage!.zoom);
            theViewer.current.moveTo(
              theCurrentImage!.left,
              theCurrentImage!.top
            );
          }

          // otherwise, perform initial fit based on the formula
          else if (
            (theViewer.current?.containerData.width/theViewer.current?.containerData.height)
            >theViewer.current?.imageData.aspectRatio
          )
          {
            fitHeight(true);
          }

          else
          {
            fitWidth(true);
          }
        }
      });

      keyControl();
      mouseHider();

      linksLoad(await requestAlbum(props.match.params.albumpath));
      setTitle(props.match.params.albumpath);
    })();
  },[]);

  // navigate to 0 on imgs change.
  useEffect(()=>{
    navigateImage(0);
  },[theImgs]);

  // update viewer on various state changes
  useEffect(()=>{
    theViewer.current?.update();
  },[theCurrentImage,theImgs,theCurrentImageIndex]);


  /** --- METHODS --- */
  //do fit width on the viewer
  function fitWidth(initial:boolean=false):void
  {
    theViewer.current?.zoomTo(
      theViewer.current?.containerData.width/theViewer.current?.imageData.naturalWidth
    );

    theViewer.current?.moveTo(
      0,
      theViewer.current?.containerData.height/2-theViewer.current?.imageData.height/2
    );

    if (!initial)
    {
      setStatusText("Fit Width");
    }
  }

  //do fit height on the viewer
  function fitHeight(initial:boolean=false):void
  {
    theViewer.current?.zoomTo(
      theViewer.current?.containerData.height/theViewer.current?.imageData.naturalHeight
    );

    theViewer.current?.moveTo(
      theViewer.current?.containerData.width/2-theViewer.current?.imageData.width/2,
      0
    );

    if (!initial)
    {
      setStatusText("Fit Height");
    }
  }

  //navigate to the given image index
  function navigateImage(imgIndex:number):void
  {
    if (imgIndex>=theImgs.length || imgIndex<0)
    {
      return;
    }

    var currentimage=theCurrentImage;
    if (!currentimage)
    {
      currentimage=theImgs[0];
    }

    // console.log(currentimage);
    // console.log(theViewer.current?);

    if (!imageChangeInProgress.current)
    {
      currentimage.zoom=theViewer.current?.imageData.ratio;
      currentimage.left=theViewer.current?.imageData.left;
      currentimage.top=theViewer.current?.imageData.top;
    }

    imageChangeInProgress.current=true;
    var newimage:ImageObject=theImgs[imgIndex];

    setCurrentImage(newimage);
    setCurrentImageIndex(imgIndex);
    setStatusText(newimage.link);
  }

  /** toggle viewer transitions */
  function toggleTransitionMode():void
  {
    transitions.current=!transitions.current;
    theViewer.current!.options.transition=transitions.current;

    var transitionText:string=transitions.current?"ON":"OFF";

    setStatusText(`set transitions ${transitionText}`);
  }

  //deploy global keyboard controls
  function keyControl():void
  {
    document.addEventListener("keydown",(e:KeyboardEvent)=>{
      // console.log(e.key);
      if (e.key!="f")
      {
        justFitHeight.current=false;
      }

      if (e.key=="e")
      {
        theViewer.current?.zoom(.1,true);
      }

      else if (e.key=="q")
      {
        theViewer.current?.zoom(-.1,true);
      }

      else if (e.key=="ArrowRight" || e.key==" " || e.key=="d")
      {
        navigateImage(theCurrentImageIndex+1);
      }

      else if (e.key=="ArrowLeft" || e.key=="a")
      {
        navigateImage(theCurrentImageIndex-1);
      }

      else if (e.key=="f")
      {
        if (justFitHeight.current)
        {
          fitWidth();
          justFitHeight.current=false;
        }

        else
        {
          fitHeight();
          justFitHeight.current=true;
        }
      }

      else if (e.key=="Escape")
      {
        setPanelShowing(!panelShowing);
      }

      else if (e.key=="t")
      {
        toggleTransitionMode();
      };
    });
  }

  // deploy timer for executing mouse hides
  function mouseHider():void
  {
    // every 1 second, increment the hide timer. when the hide timer reaches
    // 5, and the mouse is currently not hidden, hide the mouse
    setInterval(()=>{
      hideTimer.current++;

      if (hideTimer.current>=3 && !mouseHidden)
      {
        setMouseHidden(true);
      }
    },1000);

    // every time the mouse moves, set the hide timer back to 0. if the mouse was
    // hidden, unhide it.
    document.addEventListener("mousemove",()=>{
      hideTimer.current=0;

      if (mouseHidden)
      {
        setMouseHidden(false);
      }
    });
  }

  // given array of valid urls, set the imgs to those urls
  function linksLoad(urls:string[]):void
  {
    var imgs:ImageObject[]=_.map(urls,(x:string)=>{
      return {
        link:x
      };
    });

    setImgs(imgs);

    thumbnails.current=_.map(urls,(x:string)=>{
      var match=x.match(/\/imagedata(.*)/);
      if (match && match[1])
      {
        return `/thumbnaildata/${match[1]}`
          .replace(/mp4|webm|png|jpeg|webp|gif/,"jpg")
          .replace(/\/\//,"/");
      }

      return "";
    });
  }

  // toggle preview panel showing state
  function togglePanelShowing():void
  {
    setPanelShowing(!panelShowing);
  }

  /** --- RENDER --- */
  if (theViewer.current)
  {
    theViewer.current?.view(theCurrentImageIndex);
  }

  var videoMode:boolean=false;
  if (theCurrentImage && isVideo(theCurrentImage.link))
  {
    videoMode=true;
  }

  const viewerClasses={
    "mouse-hide":mouseHidden,
    "video-mode":videoMode
  };

  return <>
    <StatusIndicator text={theStatusText}/>

    <div className={cx("the-viewer",viewerClasses)}>
      <ul ref={theViewerElement}>
        {_.map(theImgs,(x:ImageObject,i:number)=>{
          var link:string=x.link;

          if (isVideo(link))
          {
            link="";
          }

          return <li key={i}><img src={link} loading="lazy"/></li>;
        })}
      </ul>

      <VideoView src={theCurrentImage?.link}/>
    </div>

    <PreviewPanel thumbnails={thumbnails.current} currentImageIndex={theCurrentImageIndex}
      showing={panelShowing} navigateImage={navigateImage}
      togglePanelShowing={togglePanelShowing}/>
  </>;
}

// retrieve images from a specified album path
async function requestAlbum(path:string):Promise<string[]>
{
  return (await fetch("/get-album",{
    method:"POST",
    body:path
  })).json();
}

// set the page title given album path
function setTitle(albumpath:string):void
{
  document.title=_.last(albumpath.split("/")) as string;
}

// --- main wrapper ---
class EhViewerMainRouter extends React.Component
{
  render()
  {
    return <Router>
      <Switch>
        <Route path="/:initial/:albumpath+" component={EhViewerMain}/>
      </Switch>
    </Router>;
  }
}

function main()
{
  ReactDOM.render(<EhViewerMainRouter/>,document.querySelector(".main"));
}

window.onload=main;