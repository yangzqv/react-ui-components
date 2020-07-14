import React, { FC, useState, useContext } from "react";
import classNames from "classnames";
import Icon from "../Icon/icon";
import { SubMenuProps, MenuItemProps, menuContext } from "./MenuProps";

const SubMenu: FC<SubMenuProps> = (props) => {
  const { index, title, children, className, style } = props;
  const menuContextInfo = useContext(menuContext);
  const openedSubmenus = menuContextInfo.defaultOpenSubMenus as Array<string>; //defaultOpenSubMenus是一个可选参数，这里断言以便安全使用数组的includes方法
  const isOpend =
    index && menuContextInfo.mode === "vertical"
      ? openedSubmenus.includes(index)
      : false; //垂直排列才存在默认展开
  const [menuOpen, setOpen] = useState(isOpend);

  const classes = classNames("menu-item submenu-item", className, {
    "is-active": menuContextInfo.index === index,
    // 'is-opened': menuOpen,
    // 'is-vertical': menuContextInfo.mode === 'vertical'
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(!menuOpen);
  };

  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();

    timer = setTimeout(() => {
      setOpen(toggle);
    }, 300);
  };

  const clickEvent =
    menuContextInfo.mode === "vertical"
      ? {
          onClick: handleClick,
        }
      : {};

  const hoverEvents =
    menuContextInfo.mode !== "vertical"
      ? {
          onMouseEnter: (e: React.MouseEvent) => handleMouse(e, true),
          onMouseLeave: (e: React.MouseEvent) => handleMouse(e, false),
        }
      : {};

  function renderChildren() {
    const subMenuClasses = classNames("submenu-con", {
      "menu-opened": menuOpen,
    });
    const childrenComponents = React.Children.map(
      children,
      (child, childIndex) => {
        const childElement = child as React.FunctionComponentElement<
          MenuItemProps
        >;
        const { displayName } = childElement.type;
        if (displayName === "MenuItem") {
          return React.cloneElement(childElement, {
            index: `${index}-${childIndex}`,
          });
        } else {
          console.error(
            "Warning: SubMenu has a child which is not a MenuItem component"
          );
        }
      }
    );

    return <ul className={subMenuClasses}>{childrenComponents}</ul>;
  }

  return (
    <li key={index} className={classes} style={style} {...hoverEvents}>
      <p className="submenu-title" {...clickEvent}>
        {title}
        <Icon icon="angle-down" className="arrow-icon" />
      </p>
      {renderChildren()}
    </li>
  );
};

SubMenu.displayName = "SubMenu";
export default SubMenu;
