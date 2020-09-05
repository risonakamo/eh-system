import React from "react";

import "./albumtoast.less";

export default class AlbumToast extends React.Component
{
  render()
  {
    return <div className="album-toasts">
      <span className="single-toast">HOME</span>
      <span className="toast-divider">/</span>
      <span className="single-toast active">boom</span>
    </div>;
  }
}