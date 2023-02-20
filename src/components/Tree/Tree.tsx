import React, { useEffect, useRef, useState } from "react";
import { App as globalAntd } from "antd";
import { Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { selectRightList } from "../../store/slices/rightSlice";
import { RightInter } from "../../interface/RightInterface";
import { listToTree } from "../../utils/formaters";
import { StatusType } from "../../views/RoleList/RoleList";
import axios from "axios";

interface MyTreeProps {
  roleId?: number;
  status: StatusType;
  treeCallBack: any
}

const App: React.FC<MyTreeProps> = (props) => {
  const { roleId, status, treeCallBack } = props;
  const treeRef = useRef(null);
  const [defaultKeys, setDefaultKeys] = useState([]);
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  const dispatch = useDispatch<AppDispatch>();
  const rightList = useSelector(selectRightList);
  const treeData: DataNode[] = listToTree<RightInter>(
    rightList as RightInter[]
  );

  useEffect(() => {
    if (roleId) {
      const getRole = async () => {
        const res = await axios.get(`role/${roleId}`);
        if (res.data.errno === 0) {
          setDefaultKeys(
            res.data.data.right_list.split(",").map((id: any) => parseInt(id))
          );
        } else {
          message.error("获取角色信息错误");
          setDefaultKeys([]);
        }
      };
      getRole();
    }
  }, [roleId]);

  const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
    // console.log("onCheck", checkedKeys, info);
    setDefaultKeys(checkedKeys as any)
    treeCallBack((checkedKeys as any).checked.sort((a: any, b: any) => a - b).join(','))
  };
  return (
    <>
      <Tree
        ref={treeRef}
        checkable
        checkStrictly
        defaultExpandedKeys={[]}
        checkedKeys={defaultKeys}
        defaultCheckedKeys={[]}
        onCheck={onCheck}
        treeData={treeData}
      />
    </>
  );
};

export default App;
