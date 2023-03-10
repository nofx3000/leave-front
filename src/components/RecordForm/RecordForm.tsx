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
  // ?????????????????????UserCascader???form.item??????
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
    // ????????????
    (formRef.current as any).submit();
  };

  const onTriggerd = (value: any) => {
    // ??????UserCascader?????????????????????????????????
    (formRef.current as any).setFieldValue("operator_list", value.join());
    setCascaderTrigger(false);
  };

  const handleCancel = () => {
    dispatch(setOpenRecordFormModal(false));
    (formRef.current as any).resetFields();
  };

  const onFinish = async (values: any) => {
    // ?????????recordListUser???????????????????????????????????????
    if (location.pathname === "/recordListUser") {
      (formRef.current as any).setFieldsValue(
        Object.assign({
          operator_list: userinfo?.id.toString(),
          values,
        })
      );
    }
    const newValue = (formRef.current as any).getFieldsValue();
    // ??????????????????????????????
    // ??????operator_list?????????????????????????????????????????????
    // ??????????????????antd????????????validator????????????
    if (
      (!newValue.operator_list ||
        newValue.operator_list.trim().split(",").length < 1) &&
      status === "add"
      // ?????????????????????????????????????????????????????????????????????????????????
    ) {
      message.error("??????????????????????????????");
      return;
    }
    // ???????????????????????????
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
    // ??????
    if (!res || res.data.errno !== 0) {
      message.error(
        `${status === "add" ? "??????" : "??????"}????????????, ${res?.data.message}`
      );
      return;
    }
    message.success(`${status === "add" ? "??????" : "??????"}????????????`);
    dispatch(setOpenRecordFormModal(false));
    // ??????????????????????????????recordList??????
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
    message.error("????????????????????????");
  };

  const renderCascader = () => {
    if (status === "add") {
      if (location.pathname === "/recordListUser") {
        return (
          <Form.Item label="????????????" name="operator_list">
            <span>{userinfo?.realname}</span>
          </Form.Item>
        );
      } else {
        return (
          <Form.Item label="????????????" name="operator_list">
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
        <Form.Item label="????????????">
          <span>{recordMap[recordId as number].user?.realname}</span>
        </Form.Item>
      );
    }
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
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          ref={formRef}
        >
          {renderCascader()}
          <Form.Item
            label="????????????(??????)"
            name="length"
            rules={[{ required: true, message: "?????????????????????!" }]}
          >
            <InputNumber min={0} max={24} step={2} />
          </Form.Item>
          <Form.Item
            label="DatePicker"
            name="leave_at"
            rules={[{ required: true, message: "?????????????????????!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item label="??????" name="comment">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default App;
