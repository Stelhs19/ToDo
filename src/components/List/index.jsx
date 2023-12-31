import React from "react";

import "./List.scss";
import classNames from "classnames";
import Badge from "../Badge";
import removeSvg from "../../assets/close.svg";

import axios from "axios";


export default function List({
  items,
  isRemovable,
  onClick,
  onRemove,
  onClickItem,
  activeItem,
}) {
  const removeList = (item) => {
    if (window.confirm("Вы действительно хотите удалить список?")) {
      axios
        .delete("http://localhost:3001/lists/" + item.id)
        .then(() => {
          onRemove(item.id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <ul onClick={onClick} className="list">
      {items.map((item, index) => (
        <li
          key={index}
          className={classNames(item.className, {
            active: item.active
              ? item.active
              : activeItem && activeItem.id === item.id,
          })}
          onClick={onClickItem ? () => onClickItem(item) : null}
        >
          <i>{item.icon ? item.icon : <Badge color={item.color.name} />}</i>
          <span>
            {item.name}
            {item.tasks && ` (${item.tasks.length})`}
          </span>
          {isRemovable && (
            <img
              className="list__remove-icon"
              src={removeSvg}
              alt="Remove icon"
              onClick={() => removeList(item)}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
