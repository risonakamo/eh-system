import React from "react";

import "./status-indicator.less";

interface StatusIndicatorProps
{
  text:string
}

export default function StatusIndicator(props:StatusIndicatorProps):JSX.Element
{
  return <div className="status-indicator">
    {props.text}
  </div>;
}