import React, { useEffect } from "react";
import { Layout } from "antd";
import style from "./Index.module.scss";
import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import MyHeader from "../../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getRoleList } from "../../store/slices/roleSlice";
import { getRightList } from "../../store/slices/rightSlice";
import { getUserListAsync } from "../../store/slices/userinfoSlice";
import { getTaskList } from "../../store/slices/taskSlice";
import { getMenuListAsync } from "../../store/slices/menuSlice";
import axios from "axios";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // 初始化redux数据
  useEffect(() => {
    if (axios.defaults.headers["authorization"]) {
      dispatch(getRoleList());
      dispatch(getUserListAsync());
      dispatch(getRightList());
      dispatch(getTaskList());
      dispatch(getMenuListAsync());
    }
    console.log("======", axios.defaults.headers["authorization"]);
  }, []);

  return (
    <Layout>
      {/* <Header className={style.header}>Header</Header> */}
      <Layout>
        <Sider className={style.sider} breakpoint="lg">
          <Menu className="s" />
        </Sider>
        <Layout>
          <Header className={style.header}>
            <MyHeader />
          </Header>
          <Content className={style.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
