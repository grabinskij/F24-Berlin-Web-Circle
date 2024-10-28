import React from "react";

const ShareIcon = ({ height, width, fill }) => {
  const iconStyle = {
    height: `${height}px`,
    width: `${width}px`,
    fill: fill,
  };
  return (
    <svg
      style={iconStyle}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      enableBackground="new 0 0 50 50"
    >
      <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z" />
      <path d="M24 7h2v21h-2z" />
      <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z" />
    </svg>
  );
};

export default ShareIcon;
