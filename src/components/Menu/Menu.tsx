import React, { ReactNode, useEffect } from "react";
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
  path: string;
  icon: string | ReactNode;
  type?: string;
  children?: any;
  key?: number;
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
  const menuList: MenuItemInter[] = useSelector(selectMenuList);
  useEffect(() => {
    dispatch(getMenuListAsync());
  }, [dispatch]);
  function formatMenuList(menuList: MenuItemInter[]): MenuItemInter[] {
    return menuList.map((item) => {
      return Object.assign({}, item, {
        key: item.path,
        icon: stringToIconMap[item.icon as string],
      });
    });
  }

  return (
    <>
      <Menu
        className={style.menu}
        defaultSelectedKeys={["/home"]}
        mode="inline"
        theme="dark"
        items={formatMenuList(menuList) as any}
        onClick={(item) => {
          navigate(item.key);
        }}
      />
    </>
  );
};

export default App;
