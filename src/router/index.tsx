import {
  RouterProvider,
  Navigate,
  createHashRouter,
} from "react-router-dom";
import JwtAuth from "../utils/JwtAuth";
import Login from "../views/Login/Login";
import Index from "../views/Index/Index";

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
    // children: [
    //   {
    //     index: true,
    //     element: <Navigate to="/home"></Navigate>,
    //   },
    //   {
    //     path: "home",
    //     element: <Home />,
    //   },
    //   {
    //     path: "basic-info",
    //     element: <BasicInfo />,
    //   },
    //   {
    //     path: "input-record",
    //     element: <InputRecord />,
    //   },
    //   {
    //     path: "check-info",
    //     element: <CheckInfo></CheckInfo>,
    //   },
    // ],
  },
]);

export default function Router() {
  return <RouterProvider router={router}></RouterProvider>;
}
