import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { App as globalAntd } from "antd";
import style from "./home.module.scss";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;

  return <>home</>;
};

export default App;
