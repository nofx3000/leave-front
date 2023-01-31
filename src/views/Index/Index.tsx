import React from "react";
import { Layout } from "antd";
import style from "./Index.module.scss";
import { Outlet } from "react-router-dom";
import Menu from "../../components/Menu/Menu";

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout>
      {/* <Header className={style.header}>Header</Header> */}
      <Layout>
        <Sider className={style.sider} breakpoint="lg">
          <Menu className="s" />
        </Sider>
        <Content className={style.content}>
          content
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
