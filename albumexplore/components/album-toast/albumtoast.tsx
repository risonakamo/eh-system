import React from "react";
import {Link} from "react-router-dom";
import _ from "lodash";

import SasButton from "../../../ehviewer/components/sas-button/sasbutton";
import AMButton from "../album-menu-button/album-menu-button";

import "./albumtoast.less";

interface AlbumToastProps
{
  targetPath:string
  navigateRandom():void //navigate random album button action
  navigateCurrent():void //navigate to current album action
}

export default class AlbumToast extends React.Component
{
  props:AlbumToastProps

  // create toasts from props
  generateToasts():(JSX.Element|null)[]
  {
    var subpaths:string[]=splitToSubPaths(this.props.targetPath);
    var singlepaths:string[]=this.props.targetPath.split("/");

    return _.flatMap(singlepaths,(x:string,i:number)=>{
      return generateToast(x,subpaths[i],i==singlepaths.length-1);
    });
  }

  render()
  {
    return <div className="album-toasts">
      <div className="icon-zone">
        <SasButton href="/" className="home-icon" routerLink={true}/>
        <AMButton onClick={this.props.navigateRandom} title="Select Random"/>
        <AMButton onClick={this.props.navigateCurrent} disabled={!this.props.targetPath} title="Open Album"/>
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