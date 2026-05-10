import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/Home/Home";
import RCWP from "../pages/RCWP/RCWP";
import LoginBox from "../layout/LoginBox";
// import Login from "../auth/Login/Login";
import LoginPage from "../auth/Login/Login";
import Register from "../auth/Register/Register";

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
    path: "/",
    Component: LoginBox,
    children: [
      {
        path: "login",
        Component: LoginPage,
      },
      { 
        path: "register",
        Component: Register,
      }
    ],
  },
]);