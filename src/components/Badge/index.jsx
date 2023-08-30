import React from "react";
import classNames from "classnames";

import "./Badge.scss";
import "../AddList/AddListButton.scss";

export default function Badge({ color, onClick, className }) {
  return (
    <i
      className={classNames("badge", { [`badge--${color}`]: color }, className)}
      onClick={onClick}
    ></i>
  );
}
