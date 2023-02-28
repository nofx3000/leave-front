import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// -------------------------redux-------------------------
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getRecordListAsync,
  getRecordListDivisionAsync,
  getRecordListUserAsync,
  selectOpenModel,
  selectRecordList,
  setOpenRecordFormModal,
} from "../../store/slices/recordSlice";
import { selectUserinfo } from "../../store/slices/userinfoSlice";
// -------------------------antd & components-------------------------
import {
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  InputNumber,
  DatePicker,
} from "antd";
import { App as globalAntd } from "antd";
import UserCascader from "../../components/UserCascader/UserCascader";
// -------------------------types-------------------------
import { RecordInter } from "../../interface/RecordInterface";
import { StatusType } from "../../views/RecordList/RecordListAll";
import { UserInfoInter } from "../../interface/UserInterface";
// -------------------------utils-------------------------
import axios from "axios";
import {
  listToMap,
  objToFieldDataArray,
  sequelizeTimeToAntdTime,
} from "../../utils/formaters";
import dayjs from "dayjs";

interface RecordFormProps {
  status: StatusType;
  recordId?: number;
}

const App: React.FC<RecordFormProps> = (props) => {
  const { status, recordId } = props;
  // ------------------------- utils -------------------------
  const dispatch = useDispatch<AppDispatch>();
  const staticFunction = globalAntd.useApp();
  const message = staticFunction.message;
  // ------------------------- initialize -------------------------
  const formRef = useRef(null);
  const location = useLocation(); // {pathname,hash,key,search,state}
  const openModal = useSelector(selectOpenModel);
  const recordList: RecordInter[] | undefined = useSelector(selectRecordList);
  const userinfo: UserInfoInter | undefined = useSelector(selectUserinfo);
  const recordMap = listToMap<RecordInter>(recordList as RecordInter[]);
  // 控制点击提交时UserCascader给form.item赋值
  const [cascaderTrigger, setCascaderTrigger] = useState<boolean>(false);
  // ------------------------- useEffect -------------------------
  useEffect(() => {
    if (openModal) {
      if (status === "edit" && recordId) {
        const record: any = sequelizeTimeToAntdTime(recordMap[recordId]);
        (formRef.current as any).setFields(objToFieldDataArray(record));
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
    dispatch(setOpenRecordFormModal(false));
    (formRef.current as any).resetFields();
  };

  const onFinish = async (values: any) => {
    // 如果是recordListUser页面只添加当前用户为作业员
    if (location.pathname === "/recordListUser") {
      (formRef.current as any).setFieldsValue(
        Object.assign({
          operator_list: userinfo?.id.toString(),
          values,
        })
      );
    }
    const newValue = (formRef.current as any).getFieldsValue();
    // 此处手动添加表单校验
    // 因为operator_list表单项是在点击提交后才进行赋值
    // 所以无法使用antd的自定义validator进行校验
    if (
      (!newValue.operator_list ||
        newValue.operator_list.trim().split(",").length < 1) &&
      status === "add"
      // 只有在添加的时候才进行验证，编辑时只涉及某人的一条记录
    ) {
      message.error("请选择至少一名作业员");
      return;
    }
    // 发送添加或编辑请求
    sendRequest();
  };

  const sendRequest = async () => {
    const values = (formRef.current as any).getFieldsValue();
    let res;
    if (status === "add") {
      res = await axios.post("/record", values);
    } else {
      res = await axios.put(`/record/${recordId}`, values);
    }
    // 回显
    if (!res || res.data.errno !== 0) {
      message.error(
        `${status === "add" ? "添加" : "编辑"}调休失败, ${res?.data.message}`
      );
      return;
    }
    message.success(`${status === "add" ? "添加" : "编辑"}调休成功`);
    dispatch(setOpenRecordFormModal(false));
    // 根据不同页面刷新不同recordList数据
    if (location.pathname === "/recordListUser") {
      dispatch(getRecordListUserAsync(userinfo?.id as number));
    } else if (location.pathname === "/recordListDivision") {
      dispatch(getRecordListDivisionAsync(userinfo?.division_id as number));
    } else {
      dispatch(getRecordListAsync());
    }
    (formRef.current as any).resetFields();
  };

  const onFinishFailed = (error: any) => {
    message.error("请按要求填写表单");
  };

  const renderCascader = () => {
    if (status === "add") {
      if (location.pathname === "/recordListUser") {
        return (
          <Form.Item label="倒休人员" name="operator_list">
            <span>{userinfo?.realname}</span>
          </Form.Item>
        );
      } else {
        return (
          <Form.Item label="倒休人员" name="operator_list">
            <UserCascader
              trigger={cascaderTrigger}
              onTriggered={onTriggerd}
              status={status}
            />
          </Form.Item>
        );
      }
    } else {
      return (
        <Form.Item label="倒休人员">
          <span>{recordMap[recordId as number].user?.realname}</span>
        </Form.Item>
      );
    }
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
          {renderCascader()}
          <Form.Item
            label="调休时长(小时)"
            name="length"
            rules={[{ required: true, message: "请填写调休时长!" }]}
          >
            <InputNumber min={0} max={24} step={2} />
          </Form.Item>
          <Form.Item
            label="DatePicker"
            name="leave_at"
            rules={[{ required: true, message: "请填写倒休时间!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="备注" name="comment">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
