import React, { useEffect } from "react";
import { Layout } from "antd";
import style from "./Index.module.scss";
import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getRoleList } from "../../store/slices/roleSlice";
import { getRightList } from "../../store/slices/rightSlice";
import { getUserListAsync } from "../../store/slices/userinfoSlice";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // 初始化redux数据
  useEffect(() => {
    dispatch(getRoleList());
    dispatch(getUserListAsync());
    dispatch(getRightList());
  });
  return (
    <Layout>
      {/* <Header className={style.header}>Header</Header> */}
      <Layout>
        <Sider className={style.sider} breakpoint="lg">
          <Menu className="s" />
        </Sider>
        <Content className={style.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
