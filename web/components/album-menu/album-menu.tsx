import React from "react";
import {Link} from "react-router-dom";
import _ from "lodash";

import SasButton from "components/sas-button/sasbutton";
import AMButton from "components/album-menu-button/album-menu-button";

import "./album-menu.less";

interface AlbumMenuProps
{
  targetPath:string
  navigateRandom():void //navigate random album button action
  navigateRandomNewTab():void
  navigateCurrent():void //navigate to current album action
}

export default class AlbumMenu extends React.Component
{
  props:AlbumMenuProps

  // create toasts from props
  generateToasts():(JSX.Element|null)[]
  {
    var subpaths:string[]=splitToSubPaths(this.props.targetPath);
    var singlepaths:string[]=this.props.targetPath.split("/");
    this.setTitle(_.last(singlepaths));

    return _.flatMap(singlepaths,(x:string,i:number)=>{
      return generateToast(x,subpaths[i],i==singlepaths.length-1);
    });
  }

  /** attempt to set the page title. give it the end of the paths */
  setTitle(target:string|undefined):void
  {
    var title:string="Albums";

    if (target && target.length)
    {
      title=`${title} - ${target}`;
    }

    document.title=title;
  }

  render()
  {
    return <div className="album-toasts">
      <div className="icon-zone">
        <SasButton href="/" className="home-icon" routerLink={true}/>
        <AMButton onClick={this.props.navigateRandom} onCtrlClick={this.props.navigateRandomNewTab}
          title="Select Random" normalIcon="/assets/imgs/shuffle-white.png"
          hoverIcon="/assets/imgs/shuffle-pink.png"/>
        <AMButton onClick={this.props.navigateCurrent} disabled={!this.props.targetPath} title="Open Album"
          normalIcon="/assets/imgs/viewer-white.png" hoverIcon="/assets/imgs/viewer-pink.png"/>
      </div>
      <div className="toast-zone">
        {this.generateToasts()}
      </div>
    </div>;
  }
}

// given a target path, split up the paths into sub paths for each
// level in the target path.
// ex: a/b/c -> a, a/b, a/b/c
function splitToSubPaths(targetPath:string):string[]
{
  var splitTarget:string[]=targetPath.split("/");
  var splitTargetCopy:string[]=_.clone(splitTarget);

  return _.reverse(_.map(splitTarget,()=>{
    var res:string=splitTargetCopy.join("/");
    splitTargetCopy.pop();
    return "/"+res;
  }));
}

// given a title, the link, and whether it is the last toast in the toast list or not,
// return a toast and its divider, or just the toast if it is the last one.
function generateToast(title:string,link:string,lastToast?:boolean):(JSX.Element|null)[]
{
  var divider:JSX.Element|null=null;
  if (!lastToast)
  {
    divider=<span className="toast-divider" key={`${title}-divider`}>/</span>;
  }

  var toast:JSX.Element;
  if (!lastToast)
  {
    toast=<Link className="single-toast" to={link} key={title} replace>{title}</Link>;
  }

  else
  {
    toast=<span className="single-toast active" key={title}>{title}</span>;
  }

  return [
    toast,
    divider
  ];
}