import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
// -------------------------redux-------------------------
import { AppDispatch } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  getLeaveListAsync,
  getLeaveListDivisionAsync,
  getLeaveListUserAsync,
  selectOpenModel,
  selectLeaveList,
  setOpenLeaveFormModal,
} from "../../store/slices/leaveSlice";
import { selectTaskList } from "../../store/slices/taskSlice";
import { selectUserinfo } from "../../store/slices/userinfoSlice";
// -------------------------antd & components-------------------------
import {
  Switch,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  InputNumber,
  Select,
} from "antd";
import { App as globalAntd } from "antd";
import UserCascader from "../../components/UserCascader/UserCascader";
// -------------------------types-------------------------
import { LeaveInter } from "../../interface/LeaveInterface";
import { StatusType } from "../../views/LeaveList/LeaveListAll";
// -------------------------utils-------------------------
import axios from "axios";
import { listToMap, objToFieldDataArray } from "../../utils/formaters";
import { TaskInter } from "../../interface/TaskInterface";
import { UserInfoInter } from "../../interface/UserInterface";

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
  const location = useLocation(); // {pathname,hash,key,search,state}
  const openModal = useSelector(selectOpenModel);
  const leaveList: LeaveInter[] | undefined = useSelector(selectLeaveList);
  const taskList: TaskInter[] | undefined = useSelector(selectTaskList);
  const userinfo: UserInfoInter | undefined = useSelector(selectUserinfo);
  const leaveMap = listToMap<LeaveInter>(leaveList as LeaveInter[]);
  // ?????????????????????UserCascader???form.item??????
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
    // ????????????
    (formRef.current as any).submit();
  };

  const onTriggerd = (value: any) => {
    // ??????UserCascader?????????????????????????????????
    (formRef.current as any).setFieldValue("operator_list", value.join());
    setCascaderTrigger(false);
  };

  const handleCancel = () => {
    dispatch(setOpenLeaveFormModal(false));
    (formRef.current as any).resetFields();
  };

  const onFinish = async (values: any) => {
    // ?????????leaveListUser???????????????????????????????????????
    if (location.pathname === "/leaveListUser") {
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
      res = await axios.post("/leave", values);
    } else {
      // if (leaveId) {
      //   // ????????????operator_list?????????user_id
      //   (formRef.current as any).setFieldValue(
      //     "use_id",
      //     leaveMap[leaveId as number].user?.id
      //   );
      //   console.log((formRef.current as any).getFieldsValue());
      // }
      res = await axios.put(`/leave/${leaveId}`, values);
    }
    // ??????
    if (!res || res.data.errno !== 0) {
      message.error(
        `${status === "add" ? "??????" : "??????"}????????????, ${res?.data.message}`
      );
      return;
    }
    message.success(`${status === "add" ? "??????" : "??????"}????????????`);
    dispatch(setOpenLeaveFormModal(false));
    // ??????????????????????????????leaveList??????
    if (location.pathname === "/leaveListUser") {
      dispatch(getLeaveListUserAsync(userinfo?.id as number));
    } else if (location.pathname === "/leaveListDivision") {
      dispatch(getLeaveListDivisionAsync(userinfo?.division_id as number));
    } else {
      dispatch(getLeaveListAsync());
    }
    (formRef.current as any).resetFields();
  };

  const onFinishFailed = (error: any) => {
    message.error("????????????????????????");
  };

  const renderCascader = () => {
    if (status === "add") {
      if (location.pathname === "/leaveListUser") {
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
          <span>{leaveMap[leaveId as number].user?.realname}</span>
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
          {/* {status === "add" ? (
            <Form.Item label="????????????" name="operator_list">
              <UserCascader
                trigger={cascaderTrigger}
                onTriggered={onTriggerd}
                status={status}
              />
            </Form.Item>
          ) : (
            <Form.Item label="????????????">
              <span>{leaveMap[leaveId as number].user?.realname}</span>
            </Form.Item>
          )} */}
          {renderCascader()}
          <Form.Item label="????????????" name="task_id">
            <Select>
              {taskList?.map((task: TaskInter) => (
                <Select.Option value={task.id} key={task.id}>
                  {task.task_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="??????" name="comment">
            <Input />
          </Form.Item>
          <Form.Item
            label="????????????(??????)"
            name="length"
            rules={[{ required: true, message: "?????????????????????!" }]}
          >
            <InputNumber min={0} max={24} step={0.5} />
          </Form.Item>
          {userinfo &&
            (userinfo.role?.role_name === "admin" ||
              userinfo.role?.role_name === "enginner") && (
              <Form.Item
                label="????????????"
                name="approved"
                valuePropName="checked"
              >
                <Switch defaultChecked={false} />
              </Form.Item>
            )}
        </Form>
      </Modal>
    </>
  );
};

export default App;
