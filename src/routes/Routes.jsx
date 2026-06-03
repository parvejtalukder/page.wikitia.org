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
import Payments from "../payments/Payments";
import AdminDashboard from "../layout/AdminDashboard";
import Profile from "../dashboard/settings/Profile/Profile";
import EditPage from "../dashboard/EditPage/EditPage";
import MyEdits from "../dashboard/MyEdits/MyEdits";
import MyEditDetails from "../dashboard/MyEdits/MyEditDetails";
import PageCreationRequests from "../admin/PageCreationRequests/PageCreationRequests";
import AdminRoute from "./admin/AdminRoute";
import EditPageRequests from "../admin/EditPageRequests/EditPageRequests";
import AllPayments from "../admin/AllPaymnets/AllPayments";
import AllUsers from "../admin/AllUsers/AllUsers";

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
  path: "/admin",
  element: (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  ),
  children: [
    {
      path: "create-page-requests",
      element: <PageCreationRequests />
    },
    {
      path: "edit-page-requests",
      element: <EditPageRequests />
    }, {
      path: "all-payments",
      element: <AllPayments></AllPayments>
    }
    ,
    {
      path: "all-users",
      element: <AllUsers></AllUsers>
    },
    {
      path: "profile",
      element: <Profile></Profile>
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
      path: "profile",
      element: <Private><Profile /></Private>,
    },
    {
      path: "payments",
      element: <Private><Payments></Payments></Private>
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
    {
      path: "edit-page",
      element: <Private><EditPage /></Private>,
    },
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
      path: "my-edits",
      element: <Private><MyEdits /></Private>,
    },
    {
      path: "my-edits/:id",
      element: <Private><MyEditDetails /></Private>,
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