import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import reportWebVitals from "./reportWebVitals";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Order from "./pages/Order";
import PrivateRoute from "./components/PrivateRoute";
import OrderDetail from "./pages/OrderDetail";
import PaymentSuccess from "./components/PaymentSuccess";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrder";
import AdminRoute from "./components/AdminRoute";
import OrderList from "./pages/admin/OrderList";
import ProductList from "./pages/admin/ProductList";
import ProductEdit from "./pages/admin/ProductEdit";
import UserList from "./pages/admin/UserList";
import UserEdit from "./pages/admin/UserEdit";
// import Products from "./pages/Products";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/order" element={<Order />} />
        <Route path="/order/:id" element={<OrderDetail />} />
        <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myorders" element={<MyOrders />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/orderlist" element={<OrderList />} />
        <Route path="/admin/productlist" element={<ProductList />} />
        <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
        <Route path="/admin/userlist" element={<UserList />} />
        <Route path="/admin/user/:id/edit" element={<UserEdit />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
