import axios from "axios";
import { useNavigate } from "react-router-dom";
import { App as globalAntd } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import {
  selectToken,
  selectUserinfo,
  verifyTokenAsync,
} from "../store/slices/userinfoSlice";
import { useEffect } from "react";

export default function JwtAuth(props: any) {
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  // 1.浏览器是否有token
  // 2.redux是否有userinfo
  // 3.userinfo的exp时间是否过期（exp*1000）
  // 4.axios——verify
  const navigate = useNavigate();

  // !!!CAUTION!!! useDispatch泛型给AppDispatch，dispatch异步方法会报错
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  // navigate要放在useEffect里，否则会出现跳转失败的问题
  useEffect(() => {
    if (!token) {
      navigate("/login");
      // return;
    } else {
      axios.defaults.headers["authorization"] = token;
      verify();
    }
  }, [token]);

  async function verify() {
    try {
      const res = await dispatch(verifyTokenAsync());
    } catch (err) {
      message.error("沒有登錄信息，請重新登陸");
      navigate("/login");
    }
  }
  return props.children;
}
