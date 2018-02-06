import React from "react";

import {NoViewer} from './NoViewer'
import {LoadingViewer} from './LoadingViewer'
import ImageViewer from './ImageViewer'
import AudioViewer from './AudioViewer'

import './viewer.css'

function ViewMedia(props) {
  const contentType = props.state.contentType;
  if (contentType !== "") {
    if (contentType.includes("image")) {
      return <ImageViewer storageUrl={props.storageUrl}/>;
    } else if (contentType.includes("audio")) {
      return <AudioViewer state={props.state} storageUrl={props.storageUrl}/>;
    }
    return <NoViewer/>;
  }
  return <LoadingViewer />;
}

export default ViewMedia;