import React, { useState } from "react";
import Heart from "react-animated-heart";

export default function HeartClick() {
  const [isClick, setClick] = useState(false);
  return (
      <Heart isClick={isClick} onClick={() => setClick(!isClick)} />
  );
}