import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import tnc from "./pages/tnc";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import AddJob from "./pages/AddJob";
import UpdateJob from "./pages/UpdateJob";
import JobPage from "./pages/JobPage";
import JobList from "./components/JobList";
import ApplicationList from "./components/ApplicationList";
import ApplyJob from "./pages/ApplyJob";
import UserList from "./components/UserList";
import AddService from "./pages/AddService";
import ServiceList from "./components/ServiceList";
import UpdateService from "./pages/UpdateService"
import ServicePage from "./pages/ServicePage";
import Cart from "./pages/Cart";
import OrderList from "./components/OrderList";
import  UpdateOrder  from "./pages/UpdateOrder";
import Recruit from "./pages/Recruit";
import UpdateUser from "./pages/UpdateUser";
import Footer from "./components/Footer";
import UserOrders from "./components/UserOrders";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/jobpage" element={<JobPage />} />
        <Route path="/servicepage" element={<ServicePage />} />
        <Route path="/apply/:reference" element={<ApplyJob />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/update-user/:userId" element={<UpdateUser />} />
        <Route path="/user-orders/:userName" element={<UserOrders />} />



        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<AdminPrivateRoute />}>
          <Route path="/add-vacancy" element={<AddJob />} />
          <Route path="/update-vacancy/:jobId" element={<UpdateJob />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path="/add-service" element={<AddService />} />
          <Route path="/update-service/:serviceId" element={<UpdateService />} />
          <Route path="/update-order/:orderId" element={<UpdateOrder />} />
          <Route path="/recruit/:email/:name/:appId" element={<Recruit />} />          
        </Route>

        <Route element={<AdminPrivateRoute />}>
          <Route path="/all-jobs" element={<JobList />} />
          <Route path="/all-users" element={<UserList />} />
          <Route path="/all-applications" element={<ApplicationList />} />
          <Route path="/all-services" element={<ServiceList />} />
          <Route path="/all-orders" element={<OrderList />} />
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
