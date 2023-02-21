import React, { useEffect, useRef } from "react";
// -------------------------redux-------------------------
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getTaskList,
  selectOpenModel,
  selectTaskList,
  setOpenTaskFormModal,
} from "../../store/slices/taskSlice";
// -------------------------antd & components-------------------------
import { Button, Modal, Form, Input, Popconfirm } from "antd";
import { App as globalAntd } from "antd";
import UserCascader from "../../components/UserCascader/UserCascader";
// -------------------------types-------------------------
import { TaskInter } from "../../interface/TaskInterface";
import { StatusType } from "../../views/TaskList/TaskList";
// -------------------------utils-------------------------
import axios from "axios";
import { listToMap, objToFieldDataArray } from "../../utils/formaters";

interface TaskFormProps {
  status: StatusType;
  taskId?: number;
}

const App: React.FC<TaskFormProps> = (props) => {
  const { status, taskId } = props;
  // ------------------------- utils -------------------------
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  // ------------------------- initialize -------------------------
  const formRef = useRef(null);
  const openModal = useSelector(selectOpenModel);
  const taskList: TaskInter[] | undefined = useSelector(selectTaskList);
  const taskMap = listToMap<TaskInter>(taskList as TaskInter[]);
  // ------------------------- useEffect -------------------------
  useEffect(() => {
    if (openModal) {
      if (status === "edit" && taskId) {
        (formRef.current as any).setFields(
          objToFieldDataArray(taskMap[taskId])
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
    dispatch(setOpenTaskFormModal(false));
    (formRef.current as any).resetFields();
  };

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    let res;
    if (status === "add") {
      res = await axios.post("/task", values);
    } else {
      if (taskId) {
        res = await axios.put(`/task/${taskId}`, values);
      }
    }
    if (!res || res.data.errno !== 0) {
      message.error(`${status === "add" ? "添加" : "编辑"}角色失败`);
      return;
    }
    message.success(`${status === "add" ? "添加" : "编辑"}角色成功`);
    dispatch(setOpenTaskFormModal(false));
    dispatch(getTaskList());
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
            label="任务名"
            name="task_name"
            rules={[{ required: true, message: "请填写任务名!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="参与人员" name="operator_list">
            <UserCascader />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
