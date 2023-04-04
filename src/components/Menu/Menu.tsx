import React, { ReactNode, useEffect, useState } from "react";
import style from "./menu.module.scss";
import {
  AppstoreOutlined,
  TeamOutlined,
  EditOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { selectMenuList, getMenuListAsync } from "../../store/slices/menuSlice";
interface MenuItemInter {
  id: number;
  label: string;
  // path: string;
  // icon: string | ReactNode;
  type?: string;
  children?: any;
  key?: string;
}

interface RawMenuItemObj {
  [id: number]: MenuItemInter;
}

interface StringToIconInter {
  [IconName: string]: ReactNode;
}

const stringToIconMap: StringToIconInter = {
  AppstoreOutlined: <AppstoreOutlined></AppstoreOutlined>,
  TeamOutlined: <TeamOutlined></TeamOutlined>,
  EditOutlined: <EditOutlined></EditOutlined>,
  OrderedListOutlined: <OrderedListOutlined></OrderedListOutlined>,
};

const App: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [menuList, setMenuList] = useState<MenuItemInter[]>([]);
  const menuObj: RawMenuItemObj = useSelector(selectMenuList);
  useEffect(() => {
    dispatch(getMenuListAsync());
  }, []);
  useEffect(() => {
    setMenuList([
      {
        id: 0,
        label: "首页",
        key: "/home",
      },
      ...MenuObjToMenuArray(menuObj),
    ]);
    console.log(MenuObjToMenuArray(menuObj));
  }, [menuObj]);
  // function formatMenuList(menuObj: RawMenuItemObj) {
  //   const menuList: MenuItemInter[] = [
  //     {
  //       id: 0,
  //       label: "首页",
  //       key: "/home",
  //     },
  //   ];
  //   for (const id in menuObj) {
  //     menuList.push(menuObj[id]);
  //   }
  //   return menuList;
  // }

  function MenuObjToMenuArray(menuObj: RawMenuItemObj): MenuItemInter[] {
    const arr = [];
    for (const id in menuObj) {
      arr.push(menuObj[id]);
    }
    return arr;
  }

  return (
    <>
      <Menu
        className={style.menu}
        defaultSelectedKeys={["/home"]}
        mode="inline"
        theme="dark"
        items={menuList as any}
        onClick={(item) => {
          navigate(item.key);
        }}
      />
    </>
  );
};

export default App;
