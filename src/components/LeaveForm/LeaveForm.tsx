import React, { useEffect, useRef, useState } from "react";
// -------------------------redux-------------------------
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getLeaveListAsync,
  selectOpenModel,
  selectLeaveList,
  setOpenLeaveFormModal,
} from "../../store/slices/leaveSlice";
// -------------------------antd & components-------------------------
import {
  Switch,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  InputNumber,
} from "antd";
import { App as globalAntd } from "antd";
import UserCascader from "../../components/UserCascader/UserCascader";
// -------------------------types-------------------------
import { LeaveInter } from "../../interface/LeaveInterface";
import { StatusType } from "../../views/LeaveList/LeaveListAll";
// -------------------------utils-------------------------
import axios from "axios";
import { listToMap, objToFieldDataArray } from "../../utils/formaters";

interface LeaveFormProps {
  status: StatusType;
  leaveId?: number;
}

const App: React.FC<LeaveFormProps> = (props) => {
  const { status, leaveId } = props;
  // ------------------------- utils -------------------------
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  // ------------------------- initialize -------------------------
  const formRef = useRef(null);
  const openModal = useSelector(selectOpenModel);
  const leaveList: LeaveInter[] | undefined = useSelector(selectLeaveList);
  const leaveMap = listToMap<LeaveInter>(leaveList as LeaveInter[]);
  // 控制点击提交时UserCascader给form.item赋值
  const [cascaderTrigger, setCascaderTrigger] = useState<boolean>(false);
  // ------------------------- useEffect -------------------------
  useEffect(() => {
    if (openModal) {
      if (status === "edit" && leaveId) {
        (formRef.current as any).setFields(
          objToFieldDataArray(leaveMap[leaveId])
        );
      }
    }
  }, [openModal]);

  // ------------------------- handelers -------------------------
  const handleOk = () => {
    setCascaderTrigger(true);
    // 表单提交
    (formRef.current as any).submit();
  };

  const onTriggerd = (value: any) => {
    // 获取UserCascader传出的数据并附给表单项
    (formRef.current as any).setFieldValue("operator_list", value.join());
    setCascaderTrigger(false);
  };

  const handleCancel = () => {
    dispatch(setOpenLeaveFormModal(false));
    (formRef.current as any).resetFields();
  };

  const onFinish = async (values: any) => {
    // 发送添加或编辑请求
    sendRequest();
  };

  const sendRequest = async () => {
    const values = (formRef.current as any).getFieldsValue();
    let res;
    if (status === "add") {
      res = await axios.post("/leave", values);
    } else {
      if (leaveId) {
        res = await axios.put(`/leave/${leaveId}`, values);
      }
    }
    if (!res || res.data.errno !== 0) {
      message.error(`${status === "add" ? "添加" : "编辑"}调休失败`);
      return;
    }
    message.success(`${status === "add" ? "添加" : "编辑"}调休成功`);
    dispatch(setOpenLeaveFormModal(false));
    dispatch(getLeaveListAsync());
    (formRef.current as any).resetFields();
  };

  const onFinishFailed = (error: any) => {
    message.error("请按要求填写表单");
  };

  // ------------------------- JSX -------------------------
  return (
    <>
      <Modal
        title={`${status === "add" ? "添加" : "编辑"}调休`}
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
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ref={formRef}
        >
          <Form.Item label="倒休人员" name="operator_list">
            <UserCascader
              trigger={cascaderTrigger}
              onTriggered={onTriggerd}
              status={status}
            />
          </Form.Item>
          <Form.Item
            label="调休时长(小时)"
            name="length"
            rules={[{ required: true, message: "请填写调休时长!" }]}
          >
            <InputNumber min={0} max={24} step={0.5} />
          </Form.Item>
          <Form.Item label="备注" name="comment">
            <Input />
          </Form.Item>
          <Form.Item label="审核状态" name="approved" valuePropName="checked">
            <Switch defaultChecked={false} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
