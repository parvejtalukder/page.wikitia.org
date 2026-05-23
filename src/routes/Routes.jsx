import { createBrowserRouter } from "react-router";
import Root from "../layout/Root";
import Home from "../pages/Home/Home";
import RCWP from "../pages/RCWP/RCWP";
import LoginBox from "../layout/LoginBox";
// import Login from "../auth/Login/Login";
import LoginPage from "../auth/Login/Login";
import Register from "../auth/Register/Register";
import Private from "./private/Private";
import Dashboard from "../layout/Dashboard";
import CreateWikiPage from "../dashboard/CreateWikiPage/CreateWikiPage";
import MyPages from "../dashboard/MyPages/MyPages";
import PageDetails from "../dashboard/PageDetails";
import Index from "../dashboard/Index";
import Payment from "../payments/DoPayment/Payment";
import PaymentSuccess from "../payments/PaymentSuccess";

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
        // Component: RCWP,
        element: <Private><RCWP></RCWP></Private>
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
  {
  path: "/dashboard",
  element: <Private><Dashboard /></Private>,
  children: [
    {
      index: true,
      element: <Private><Index></Index></Private>
    },
    {
      path: "create-page",
      element: <Private><CreateWikiPage /></Private>,
    },
    {
      path: "payments",
      element: <Private><Payment></Payment></Private>
    },
    // {
    {
      path: "payment/submit",
      element: <Private><Payment></Payment></Private>
    },
    {
      path: "payment/done",
      element: <Private><PaymentSuccess></PaymentSuccess></Private>
    },
    // {
    //   path: "edit-page/:pageId?",
    //   element: <Private><EditWikiPage /></Private>,
    // },
    // {
    //   path: "add-image/:pageId?",
    //   element: <Private><AddImageToWiki /></Private>,
    // },
    // {
    //   path: "add-video/:pageId?",
    //   element: <Private><AddVideoToWiki /></Private>,
    // },
    {
      path: "my-pages",
      element: <Private><MyPages /></Private>,
    },
    {
      path: "my-pages/:id",
      element: <Private><PageDetails></PageDetails></Private>
    },
    // {
    //   path: "reserve",
    //   element: <Private><MakeReservation /></Private>,
    // },
    // {
    //   path: "my-reservations",
    //   element: <Private><MyReservations /></Private>,
    // },
    // {
    //   path: "payment-history",
    //   element: <Private><PaymentHistory /></Private>,
    // },
    // {
    //   path: "billing",
    //   element: <Private><BillingPage /></Private>,
    // },
    // {
    //   path: "settings",
    //   element: <Private><DashboardSettings /></Private>,
    // },
    // {
    //   index: true,
    //   element: <Private><DashboardHome /></Private>,
    // },
  ],
},
]);