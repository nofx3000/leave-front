import React, { useEffect, useRef } from "react";
// -------------------------redux-------------------------
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getRoleList,
  selectOpenModel,
  selectRoleList,
  setOpenRoleFormModal,
} from "../../store/slices/roleSlice";
// -------------------------antd & components-------------------------
import { Button, Modal, Form, Input, Popconfirm, Radio } from "antd";
import { App as globalAntd } from "antd";
import Tree from "../../components/Tree/Tree";
// -------------------------types-------------------------
import { RoleInter } from "../../interface/RoleInterface";
import { StatusType } from "../../views/RoleList/RoleList";
// -------------------------utils-------------------------
import axios from "axios";
import { listToMap, objToFieldDataArray } from "../../utils/formaters";

interface RoleFormProps {
  status: StatusType;
  roleId?: number;
}

const App: React.FC<RoleFormProps> = (props) => {
  const { status, roleId } = props;
  // ------------------------- utils -------------------------
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  // ------------------------- initialize -------------------------
  const formRef = useRef(null);
  const openModal = useSelector(selectOpenModel);
  const roleList: RoleInter[] | undefined = useSelector(selectRoleList);
  const roleMap = listToMap(roleList as RoleInter[]);
  // ------------------------- useEffect -------------------------
  useEffect(() => {
    if (openModal) {
      if (status === "edit" && roleId) {
        (formRef.current as any).setFields(
          objToFieldDataArray(roleMap[roleId])
        );
      }
    }
  }, [openModal]);
  // ------------------------- handelers -------------------------
  const handleOk = () => {
    // 表单提交
    (formRef.current as any).submit();
  };

  const handleCancel = () => {
    dispatch(setOpenRoleFormModal(false));
    (formRef.current as any).resetFields();
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    let res;
    if (status === "add") {
      res = await axios.post("/role", values);
    } else {
      if (roleId) {
        res = await axios.put(`/role/${roleId}`, values);
      }
    }
    if (!res || res.data.errno !== 0) {
      message.error(`${status === "add" ? "添加" : "编辑"}角色失败`);
      return;
    }
    message.success(`${status === "add" ? "添加" : "编辑"}角色成功`);
    dispatch(setOpenRoleFormModal(false));
    dispatch(getRoleList());
  };

  const onFinishFailed = (error: any) => {
    message.error("请按要求填写表单");
  };

  // ------------------------- JSX -------------------------
  return (
    <>
      <Modal
        title={`${status === "add" ? "添加" : "编辑"}角色`}
        open={openModal}
        onCancel={handleCancel}
        footer={[
          <Popconfirm
            placement="top"
            title={"取消操作"}
            description={"取消后数据将不被保存"}
            onConfirm={() => {
              handleCancel();
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button>取消</Button>
          </Popconfirm>,
          <Button type="primary" onClick={handleOk}>
            提交
          </Button>,
        ]}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          ref={formRef}
        >
          <Form.Item
            label="角色名"
            name="role_name"
            rules={[{ required: true, message: "请填写角色名!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="权限" name="right_list">
            <Tree roleId={roleId ? roleId : undefined} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
