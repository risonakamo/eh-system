import React,{useRef,useState,useEffect} from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import _ from "lodash";
import Viewer from "viewerjs";
import cx from "classnames";

import PreviewPanel from "components/previewpanel/previewpanel";
import VideoView,{isVideo} from "components/video-view/videoview";
import StatusIndicator from "components/status-indicator/status-indicator";

import {requestAlbum} from "api/album-api";
import {imageUrlToThumbnailUrl} from "lib/thumbnail-link";

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

const IMAGE_PRELOAD_AMOUNT:number=2;

export default function EhViewerMain(props:EhViewerProps):JSX.Element
{
  /** --- STATES --- */
  const [theCurrentImage,setCurrentImage]=useState<ImageObject|null>(null);

  const [mouseHidden,setMouseHidden]=useState<boolean>(false);
  const [panelShowing,setPanelShowing]=useState<boolean>(false);

  const [theImgs,setImgs]=useState<ImageObject[]>([]);
  const [theCurrentImageIndex,setCurrentImageIndex]=useState<number>(-1);

  const [theStatusText,setStatusText]=useState<string>("");

  const [zoomLock,setZoomLock]=useState<boolean>(false);


  /** --- REFS --- */
  const theViewer=useRef<any>(null);
  const theViewerElement=useRef<HTMLUListElement>(null);

  const imageChangeInProgress=useRef<boolean>(false);
  const justFitHeight=useRef<boolean>(false);
  const hideTimer=useRef<number>(0);

  const thumbnails=useRef<string[]>([]);

  const transitions=useRef<boolean>(false);

  const thePrevImage=useRef<ImageObject|null>(null);

  // when true, after loading an image, will turn on zoom lock
  const reenableZoomLock=useRef<boolean>(false);

  // when enabled, certain effects skipped for initial load
  const initialLoadSkip=useRef<boolean>(true);

  const savedAlbumResponse=useRef<AlbumResponse>({
    mode:"local",
    urls:[]
  });


  /** --- SYNC REFS --- */
  const syncCallbacks=useRef({
    navigateImage,
    fitWidth,
    fitHeight,
    toggleTransitionMode,
    theCurrentImageIndex,
    mouseHidden,
    theCurrentImage,
    zoomLock,
    preloadFuture
  });

  useEffect(()=>{
    syncCallbacks.current.navigateImage=navigateImage;
    syncCallbacks.current.fitWidth=fitWidth;
    syncCallbacks.current.fitHeight=fitHeight;
    syncCallbacks.current.toggleTransitionMode=toggleTransitionMode;
    syncCallbacks.current.theCurrentImageIndex=theCurrentImageIndex;
    syncCallbacks.current.mouseHidden=mouseHidden;
    syncCallbacks.current.theCurrentImage=theCurrentImage;
    syncCallbacks.current.zoomLock=zoomLock;
    syncCallbacks.current.preloadFuture=preloadFuture;
  },[navigateImage,fitWidth,fitHeight,toggleTransitionMode,theCurrentImageIndex,mouseHidden,
    theCurrentImage,zoomLock,preloadFuture]);


  /** --- EFFECTS --- */
  // initialise viewer, key handler, mouse hider. load the album and set the title.
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

          // in zoom lock mode, zoom to previous images zoom
          if (syncCallbacks.current.zoomLock && thePrevImage.current)
          {
            theViewer.current?.zoomTo(thePrevImage.current.zoom);
            theViewer.current.moveTo(
              thePrevImage.current.left,
              thePrevImage.current.top
            );
          }

          // if the current image has zoom and other custom values set, set the zoom the the values
          else if (_.get(syncCallbacks.current.theCurrentImage,"zoom"))
          {
            theViewer.current?.zoomTo(syncCallbacks.current.theCurrentImage!.zoom);
            theViewer.current.moveTo(
              syncCallbacks.current.theCurrentImage!.left,
              syncCallbacks.current.theCurrentImage!.top
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

          if (reenableZoomLock.current)
          {
            setZoomLock(true);
            reenableZoomLock.current=false;
          }

          syncCallbacks.current.preloadFuture(IMAGE_PRELOAD_AMOUNT);
        }
      });

      keyControl();
      mouseHider();

      savedAlbumResponse.current=await requestAlbum(props.match.params.albumpath);
      linksLoad(savedAlbumResponse.current.urls);
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
    theViewer.current?.view(theCurrentImageIndex);
  },[theCurrentImageIndex]);

  // update status text on zoom lock change
  useEffect(()=>{
    if (initialLoadSkip.current)
    {
      initialLoadSkip.current=false;
      return;
    }

    if (zoomLock)
    {
      setStatusText("zoom lock ON");
    }

    else
    {
      setStatusText("zoom lock OFF");
    }
  },[zoomLock]);


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

    var currentimage:ImageObject|null=theCurrentImage;
    if (!currentimage)
    {
      currentimage=theImgs[0];
    }

    if (!imageChangeInProgress.current)
    {
      currentimage.zoom=theViewer.current?.imageData.ratio;
      currentimage.left=theViewer.current?.imageData.left;
      currentimage.top=theViewer.current?.imageData.top;
    }

    imageChangeInProgress.current=true;
    thePrevImage.current=currentimage;
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
    // DE-SYNC ZONE
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
        syncCallbacks.current.navigateImage(syncCallbacks.current.theCurrentImageIndex+1);
      }

      else if (e.key=="ArrowLeft" || e.key=="a")
      {
        syncCallbacks.current.navigateImage(syncCallbacks.current.theCurrentImageIndex-1);
      }

      else if (e.key=="f")
      {
        if (justFitHeight.current)
        {
          syncCallbacks.current.fitWidth();
          justFitHeight.current=false;
        }

        else
        {
          syncCallbacks.current.fitHeight();
          justFitHeight.current=true;
        }
      }

      else if (e.key=="z")
      {
        setZoomLock((prev:boolean):boolean=>{
          return !prev;
        });
      }

      else if (e.key=="Escape")
      {
        setPanelShowing((prev:boolean):boolean=>{
          return !prev;
        });
      }

      else if (e.key=="t")
      {
        syncCallbacks.current.toggleTransitionMode();
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

      if (hideTimer.current>=3 && !syncCallbacks.current.mouseHidden)
      {
        setMouseHidden(true);
      }
    },1000);

    // every time the mouse moves, set the hide timer back to 0. if the mouse was
    // hidden, unhide it.
    document.addEventListener("mousemove",()=>{
      hideTimer.current=0;

      if (syncCallbacks.current.mouseHidden)
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
      return imageUrlToThumbnailUrl(
        x,
        savedAlbumResponse.current.mode=="cloud",
        (savedAlbumResponse.current as AlbumResponseCloud).cloudInfo
      );
    });
  }

  /** from the current image index, preload the next <preload amount> images */
  function preloadFuture(preloadAmount:number):void
  {
    const preloadImgs:ImageObject[]=theImgs.slice(
      theCurrentImageIndex+1,
      theCurrentImageIndex+1+preloadAmount
    );

    preloadImgs.forEach((x:ImageObject)=>{
      const img=new Image();
      img.src=x.link;
    });
  }


  /** --- HANDLERS --- */
  // toggle preview panel showing state
  function togglePanelShowing():void
  {
    setPanelShowing(!panelShowing);
  }

  /** preview panel would like to navigate */
  function h_previewPanelJump(img:number):void
  {
    // if attempting to jump to the same image, do nothing
    if (img==theCurrentImageIndex)
    {
      return;
    }

    // if zoom lock is enabled, then disable it, and set it to be renabled after the jump is completed.
    // by disabling zoom lock, jumping will result in a zoom level of the target image. but then, zoom
    // lock will be enabled, as it was enabled before jumping.
    if (zoomLock)
    {
      reenableZoomLock.current=true;
      setZoomLock(false);
    }

    navigateImage(img);
  }


  /** --- RENDER --- */
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
            link=thumbnails.current[i];
          }

          return <li key={i}><img src={link} loading="lazy"/></li>;
        })}
      </ul>

      <VideoView src={theCurrentImage?.link}/>
    </div>

    <PreviewPanel thumbnails={thumbnails.current} currentImageIndex={theCurrentImageIndex}
      showing={panelShowing} navigateImage={h_previewPanelJump}
      togglePanelShowing={togglePanelShowing}/>
  </>;
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