import React, { useEffect, useRef } from "react";
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
import {
  formatCatagory,
  listToMap,
  objToFieldDataArray,
} from "../../utils/formaters";
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
  const openModal = useSelector(selectOpenModel);
  const roleList = useSelector(selectRoleList);
  const userList: UserInfoInter[] | undefined = useSelector(selectUserList);
  const userMap = listToMap(userList as UserInfoInter[]);
  // ------------------------- useEffect -------------------------
  useEffect(() => {
    if (openModal) {
      if (status === "edit" && userId) {
        (formRef.current as any).setFields(
          objToFieldDataArray(userMap[userId])
        );
      }
    }
  }, [openModal]);
  // ------------------------- handelers -------------------------
  const handleOk = () => {
    // ????????????
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
      message.error(`${status === "add" ? "??????" : "??????"}????????????`);
      return;
    }
    message.success(`${status === "add" ? "??????" : "??????"}????????????`);
    dispatch(setOpenUserFormModal(false));
    dispatch(getUserListAsync());
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error("????????????????????????");
  };

  // ------------------------- JSX -------------------------
  return (
    <>
      <Modal
        title={`${status === "add" ? "??????" : "??????"}??????`}
        open={openModal}
        onCancel={handleCancel}
        footer={[
          <Popconfirm
            placement="top"
            title={"????????????"}
            description={"??????????????????????????????"}
            onConfirm={() => {
              handleCancel();
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button>??????</Button>
          </Popconfirm>,
          <Button type="primary" onClick={handleOk}>
            ??????
          </Button>,
        ]}
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          // initialValues={
          //   status === "edit" && userId ? userMap[userId as number] : {}
          // }
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          ref={formRef}
        >
          <Form.Item
            label="?????????"
            name="username"
            rules={[{ required: true, message: "??????????????????!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="????????????"
            name="realname"
            rules={[{ required: true, message: "?????????????????????!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="??????"
            name="password"
            rules={[{ required: true, message: "??????????????????" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="????????????"
            name="catagory"
            rules={[{ required: true, message: "?????????????????????!" }]}
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
            label="??????"
            name="role_id"
            rules={[{ required: true, message: "???????????????!" }]}
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
