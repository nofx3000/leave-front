import { RouterProvider, Navigate, createHashRouter } from "react-router-dom";
import JwtAuth from "../utils/JwtAuth";
import Login from "../views/Login/Login";
import Index from "../views/Index/Index";
import Home from "../views/Home/Home";
import UserList from "../views/UserList/UserList";
import RoleList from "../views/RoleList/RoleList";
import TaskList from "../views/TaskList/TaskList";
import LeaveListAll from "../views/LeaveList/LeaveListAll";
import LeaveListDivision from "../views/LeaveList/LeaveListDivision";
import LeaveListUser from "../views/LeaveList/LeaveListUser";

const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <JwtAuth>
        <Index />
      </JwtAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home"></Navigate>,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "userList",
        element: <UserList />,
      },
      {
        path: "roleList",
        element: <RoleList />,
      },
      {
        path: "taskList",
        element: <TaskList />,
      },
      {
        path: "leaveListAll",
        element: <LeaveListAll />,
      },
      {
        path: "leaveListDivision",
        element: <LeaveListDivision />,
      },
      {
        path: "leaveListUser",
        element: <LeaveListUser />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
