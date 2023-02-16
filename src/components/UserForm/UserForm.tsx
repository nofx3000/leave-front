import React, { useRef } from "react";
// -------------------------redux-------------------------
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserListAsync,
  selectOpenModel,
  selectUserList,
  setOpenUserFormModal,
} from "../../store/slices/userinfoSlice";
import { selectRoleList } from "../../store/slices/roleSlice";
// -------------------------antd-------------------------
import { Button, Modal, Form, Input, Popconfirm, Radio } from "antd";
import { App as globalAntd } from "antd";
// -------------------------types-------------------------
import { RoleInter } from "../../interface/RoleInterface";
import { StatusType } from "../../views/UserList/UserList";
// -------------------------utils-------------------------
import axios from "axios";
import { formatCatagory, userListToUserMap } from "../../utils/formaters";
import { UserInfoInter } from "../../interface/UserInterface";

interface UserFormProps {
  status: StatusType;
  userId?: number;
}

const App: React.FC<UserFormProps> = (props) => {
  const { status, userId } = props;
  // ------------------------- utils -------------------------
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  // ------------------------- initialize -------------------------
  const formRef = useRef(null);
  const openModel = useSelector(selectOpenModel);
  const roleList = useSelector(selectRoleList);
  const userList: UserInfoInter[] | undefined = useSelector(selectUserList);
  const userMap = userListToUserMap(userList as UserInfoInter[]);
  // ------------------------- handelers -------------------------
  const handleOk = () => {
    // 表单提交
    (formRef.current as any).submit();
  };

  const handleCancel = () => {
    dispatch(setOpenUserFormModal(false));
    (formRef.current as any).resetFields();
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    let res;
    if (status === "add") {
      res = await axios.post("/user/create", values);
    } else {
      if (userId) {
        res = await axios.put(`/user/${userId}`, values);
      }
    }
    if (!res || res.data.errno !== 0) {
      message.error(`${status === "add" ? "添加" : "编辑"}用户失败`);
      return;
    }
    message.success(`${status === "add" ? "添加" : "编辑"}用户成功`);
    dispatch(setOpenUserFormModal(false));
    dispatch(getUserListAsync());
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("请按要求填写表单");
  };

  // ------------------------- JSX -------------------------
  return (
    <>
      <Modal
        title={`${status === "add" ? "添加" : "编辑"}用户`}
        open={openModel}
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
            <Button onClick={handleCancel}>取消</Button>
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
          initialValues={
            status === "edit" && userId ? userMap[userId as number] : {}
          }
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          ref={formRef}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "请填写用户名!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="真实姓名"
            name="realname"
            rules={[{ required: true, message: "请填写真实姓名!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请填写密码！" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="人员类别"
            name="catagory"
            rules={[{ required: true, message: "请选择人员类别!" }]}
          >
            <Radio.Group>
              {[0, 1, 2].map((id) => {
                return (
                  <Radio value={id} key={id}>
                    {formatCatagory(id)}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="角色"
            name="role_id"
            rules={[{ required: true, message: "请选择角色!" }]}
          >
            <Radio.Group>
              {(roleList as RoleInter[]).map((role) => {
                return (
                  <Radio value={role.id} key={role.role_name}>
                    {role.role_name}
                  </Radio>
                );
              })}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
