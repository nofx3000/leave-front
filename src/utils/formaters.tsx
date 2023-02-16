import { RoleInter } from "../interface/RoleInterface";
import { UserInfoInter } from "../interface/UserInterface";

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

interface UserMapInter {
  [id: number]: UserInfoInter;
}

export const userListToUserMap = (userList: UserInfoInter[]) => {
  return userList.reduce((prev: UserMapInter, cur) => {
    prev[cur.id] = cur;
    return prev;
  }, {});
};
