export interface UserInfoInter {
  id: number;
  username: string;
  password: string;
  role_id: number;
  real_name: string;
  catagory: number
}

export interface LoginInter {
  username: string;
  password: string;
}
