import { RightInter } from "../interface/RightInterface";
import { RoleInter } from "../interface/RoleInterface";
import { UserInfoInter } from "../interface/UserInterface";
import dayjs from "dayjs";

export const roleIdToRoleName = (
  roleid: number,
  roleList: RoleInter[]
): string | void => {
  const role: RoleInter | undefined = roleList.find((item) => {
    return item.id === roleid;
  });
  if (role) {
    return role.role_name;
  }
};

export const formatCatagory = (catagory: number) => {
  switch (catagory) {
    case 0:
      return "干部";
    case 1:
      return "军士";
    case 2:
      return "文职";
    default:
      break;
  }
};

interface MapInter<T> {
  [propName: number]: T;
}

interface TInter {
  id: number;
  [propName: string]: any;
}

export const listToMap = <T extends TInter>(list: T[]): MapInter<T> => {
  return list.reduce((prev: MapInter<T>, cur) => {
    prev[cur.id] = cur;
    return prev;
  }, {});
};

// 用于编辑数据时添加表单默认值
interface MapDataInter {
  [id: string | number]: any;
}
export const objToFieldDataArray = (obj: MapDataInter) => {
  const arr = [];
  for (let key in obj) {
    // FieldData
    // errors	错误信息	string[]
    // name	字段名称	NamePath[]
    // touched	是否被用户操作过	boolean
    // validating	是否正在校验	boolean
    // value	字段对应值	any
    arr.push({
      name: key,
      value: obj[key],
    });
  }
  return arr;
};

export const listToTree = <T extends RightInter>(list: T[]) => {
  // 处理一级right
  const tree = list.reduce((acc: any, cur: T) => {
    if (cur && cur.pid === 0) {
      acc[cur.id] = {
        key: cur.id,
        children: [],
        title: cur.right_name,
      };
      return acc;
    } else {
      return acc;
    }
  }, []);
  list.forEach((right: any) => {
    if (right && right.pid !== 0) {
      tree[right.pid].children.push({
        key: right.id,
        title: right.right_name,
      });
    }
  });
  return tree;
};

export const sequelizeTimeToAntdTime = <T,>(obj: T) => {
  const _record: any = Object.assign({}, obj);
  _record.leave_at = dayjs(_record.leave_at, "yyyy-mmm-dd");
  return _record;
};
