import React, { useState, useRef } from "react";
import { Button, Modal, Form, Input, Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  selectOpenModel,
  setOpenModel,
} from "../../store/slices/userinfoSlice";

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const openModel = useSelector(selectOpenModel);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const formRef = useRef(null);
  const [modalText, setModalText] = useState("Content of the modal");

  const handleOk = () => {
    // 表单提交
    (formRef.current as any).submit();
    setModalText("正在添加用户……");
    setConfirmLoading(true);
    setTimeout(() => {
      dispatch(setOpenModel(false));
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    dispatch(setOpenModel(false));
    (formRef.current as any).resetFields();
  };

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="Title"
        open={openModel}
        onOk={handleOk}
        confirmLoading={confirmLoading}
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
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          ref={formRef}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
