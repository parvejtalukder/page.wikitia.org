import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/Home/Home";
import RCWP from "../pages/RCWP/RCWP";
import LoginBox from "../layout/LoginBox";
// import Login from "../auth/Login/Login";
import LoginPage from "../auth/Login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "request-for-creation-of-a-wikitia-page",
        Component: RCWP,
      },
    ],
  },
  {
    path: "/login",
    Component: LoginBox,
    children: [
      {
        index: true,
        Component: LoginPage,
      },
    ],
  },
]);