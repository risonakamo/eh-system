import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router,Switch,Route} from "react-router-dom";

import _ from "lodash";
import Viewer from "viewerjs";

import "./ehviewer-index.less";

class EhViewerMainRouter extends React.Component
{
  render()
  {
    return <Router>
      <Switch>
        <Route component={EhViewerMain}/>
      </Switch>
    </Router>;
  }
}

interface EhViewerState
{
  currentImage:ImageObject|null //the current showing image object

  mouseHidden:boolean //when enabled, mouse is hidden

  panelShowing:boolean

  imgs:ImageObject[] //the images
  currentImageIndex:number //the current image index
}

class EhViewerMain extends React.Component
{
  state:EhViewerState

  theviewer:any //the viewer object
  theviewerElement:RefObject<HTMLUListElement> //the viewer element
  imageChangeInProgress:boolean

  justFitHeight:boolean

  hideTimer:number //for mouse timer

  constructor(props:any)
  {
    super(props);
    this.navigateImage=this.navigateImage.bind(this);

    this.state={
      currentImage:null,
      mouseHidden:false,
      panelShowing:false,
      imgs:[],
      currentImageIndex:0
    };

    //image repositioning has not completed, dont save image positioning if the image changes
    this.imageChangeInProgress=false;

    //fit height operation occured, next time it will fit width, resets every image change to fit height
    this.justFitHeight=false;

    this.theviewerElement=React.createRef<HTMLUListElement>();

    // mouse hide stuff
    this.hideTimer=0;
  }

  componentDidMount()
  {
    this.theviewer=new Viewer(this.theviewerElement.current as Element,{
      inline:true,
      title:false,
      keyboard:false,
      button:false,
      zoomRatio:.3,
      backdrop:false,
      ready:()=>{
        this.theviewer.full();
      },
      viewed:()=>{
        this.imageChangeInProgress=false;

        // if the current image has zoom and other custom values set, set the zoom the the values
        if (_.get(this.state.currentImage,"zoom"))
        {
          this.theviewer.zoomTo((this.state.currentImage as ImageObject).zoom);
          this.theviewer.moveTo(
            (this.state.currentImage as ImageObject).left,
            (this.state.currentImage as ImageObject).top
          );
        }

        // otherwise, perform initial fit based on the formula
        else if ((this.theviewer.containerData.width/this.theviewer.containerData.height)>this.theviewer.imageData.aspectRatio)
        {
          this.fitHeight();
        }

        else
        {
          this.fitWidth();
        }
      }
    });

    (window as any).viewer=this.theviewer;
    (window as any).igaroot=this;

    this.keyControl();
    this.mouseHider();
  }

  //do fit width on the viewer
  fitWidth():void
  {
    this.theviewer.zoomTo(this.theviewer.containerData.width/this.theviewer.imageData.naturalWidth);
    this.theviewer.moveTo(0,this.theviewer.containerData.height/2-this.theviewer.imageData.height/2);
  }

  //do fit height on the viewer
  fitHeight():void
  {
    this.theviewer.zoomTo(this.theviewer.containerData.height/this.theviewer.imageData.naturalHeight);
    this.theviewer.moveTo(this.theviewer.containerData.width/2-this.theviewer.imageData.width/2,0);
  }

  //navigate to the given image index
  navigateImage(imgIndex:number):void
  {
    if (imgIndex>=this.state.imgs.length || imgIndex<0)
    {
      return;
    }

    var currentimage=this.state.currentImage;
    if (!currentimage)
    {
      currentimage=this.state.imgs[0];
    }

    // console.log(currentimage);
    // console.log(this.theviewer);

    if (!this.imageChangeInProgress)
    {
      currentimage.zoom=this.theviewer.imageData.ratio;
      currentimage.left=this.theviewer.imageData.left;
      currentimage.top=this.theviewer.imageData.top;
    }

    this.imageChangeInProgress=true;
    this.setState({
      currentImage:this.state.imgs[imgIndex],
      currentImageIndex:imgIndex
    });
  }

  //deploy global keyboard controls
  keyControl():void
  {
    document.addEventListener("keydown",(e:KeyboardEvent)=>{
      // console.log(e.key);
      if (e.key!="f")
      {
        this.justFitHeight=false;
      }

      if (e.key=="e")
      {
        this.theviewer.zoom(.1,true);
      }

      else if (e.key=="q")
      {
        this.theviewer.zoom(-.1,true);
      }

      else if (e.key=="ArrowRight" || e.key==" " || e.key=="d")
      {
        this.navigateImage(this.state.currentImageIndex+1);
      }

      else if (e.key=="ArrowLeft" || e.key=="a")
      {
        this.navigateImage(this.state.currentImageIndex-1);
      }

      else if (e.key=="f")
      {
        if (this.justFitHeight)
        {
          this.fitWidth();
          this.justFitHeight=false;
        }

        else
        {
          this.fitHeight();
          this.justFitHeight=true;
        }
      }

      else if (e.key=="Escape")
      {
        this.setState({
          panelShowing:!this.state.panelShowing
        });
      }
    });
  }

  // deploy timer for executing mouse hides
  mouseHider():void
  {
    // every 1 second, increment the hide timer. when the hide timer reaches
    // 5, and the mouse is currently not hidden, hide the mouse
    setInterval(()=>{
      this.hideTimer++;

      if (this.hideTimer>=3 && !this.state.mouseHidden)
      {
        this.setState({
          mouseHidden:true
        });
      }
    },1000);

    // every time the mouse moves, set the hide timer back to 0. if the mouse was
    // hidden, unhide it.
    document.addEventListener("mousemove",()=>{
      this.hideTimer=0;

      if (this.state.mouseHidden)
      {
        this.setState({
          mouseHidden:false
        });
      }
    });
  }

  render()
  {
    if (this.theviewer)
    {

    }

    var mouseHideClass:string=this.state.mouseHidden?"mouse-hide":"";

    return <>
      <div className={`the-viewer ${mouseHideClass}`}>
        <ul ref={this.theviewerElement}>
          {_.map(this.state.imgs,(x,i)=>{
            return <li key={i}><img src={x.link}/></li>;
          })}
        </ul>
      </div>
    </>;
  }
}

function main()
{
  ReactDOM.render(<EhViewerMainRouter/>,document.querySelector(".main"));
}

window.onload=main;