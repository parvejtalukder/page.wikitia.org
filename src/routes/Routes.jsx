import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
// import App from "../App";
import Home from "../pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
        {
            index: true,
            Component: Home,
        }
    ]
  },
]);