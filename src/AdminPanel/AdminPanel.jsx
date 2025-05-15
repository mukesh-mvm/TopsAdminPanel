import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Button, Dropdown } from "antd";
import { useAuth } from "../context/auth";
import "../Style/AdminPanel.css";
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
  CarOutlined,
  EnvironmentOutlined,
  CarryOutOutlined,
  FormOutlined,
  HomeOutlined,
  WarningOutlined,
  TruckOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

import Users from "./Users";
import BlogList from "./BlogList";
import BlogPosting from "./BlogPosting";
import Testinomial from "./Testinomial";
import Category from "./Category";
import SubCategory from "./SubCategory";
import Company from "./Company";
import CompBlog from "./CompBlog";
import Blogs from "./Blogs";
import { Profile } from "./Profile";
import TopsShorts from "./TopsShorts";
import TrendingShorts from "./TrendingShorts";
import TopHeading from "./TopHe";
import MasterCards from "./MasterCards";
// import logo from "../../public/logo.png";
// properties-details

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const [id, setId] = useState();
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
 
  const auth1 = JSON.parse(localStorage.getItem('auth'));

  const handleMenuClick = (e) => {
    setSelectedTab(e.key);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "users":
      return <Users />;

        case "categories":
        return <Category />;


        case "topShorts":
        return <TopsShorts />;

        case "trendingShorts":
        return <TrendingShorts />;

        case "topHeading":
        return <TopHeading />;


        case "profile":
        return <Profile  setSelectedTab={setSelectedTab}/>;

        case "sub-categories":
        return <SubCategory />;


        case "company":
        return <Company />;


        case "compBlog":
        return <CompBlog />;


        case "blogs":
          return <Blogs />;



         case "master-card":
        return <MasterCards setSelectedTab={setSelectedTab} />;

      // BlogList
    }
  };

  const menuItems = [
    // { key: "home", icon: <TeamOutlined />, label: "Home" },
    // { key: "users", icon: < UserOutlined/>, label: "Users" },
    { key: "profile", icon: <HomeOutlined />, label: "Profile" },
    { key: "company", icon: <TeamOutlined  />, label: "Company" },
    { key: "compBlog", icon: <TeamOutlined  />, label: "CompBlog" },
    { key: "blogs", icon: <TeamOutlined  />, label: "Blogs" },
    { key: "topShorts", icon: <TeamOutlined  />, label: "TopsShorts" },
    { key: "trendingShorts", icon: <TeamOutlined  />, label: "TrendingShorts" },
    { key: "topHeading", icon: <TeamOutlined  />, label: "TopHeadingShorts" },

     {
      key: "master-card",
      icon: <TeamOutlined />,
      label: "Merchandising",
    },
    // { key: "blog", icon: <CarOutlined />, label: "Blog" },
    // { key: "testinomial", icon: <CalendarOutlined />, label: "Testinomial" },
  ];



  const menuItems1 = [
    // { key: "home", icon: <TeamOutlined />, label: "Home" },
    { key: "profile", icon: <HomeOutlined />, label: "Profile" },
    { key: "users", icon: < UserOutlined/>, label: "Admin" },
    { key: "categories", icon: <HomeOutlined />, label: "Categories" },
    { key: "sub-categories", icon: <TeamOutlined  />, label: "Sub-Categories" },
    { key: "company", icon: <TeamOutlined  />, label: "Company" },
    { key: "compBlog", icon: <TeamOutlined  />, label: "CompBlog" },
    { key: "blogs", icon: <TeamOutlined  />, label: "Blogs" },
    // { key: "topShorts", icon: <TeamOutlined  />, label: "TopsShorts" },
    // { key: "trendingShorts", icon: <TeamOutlined  />, label: "TrendingShorts" },
    // { key: "topHeading", icon: <TeamOutlined  />, label: "TopHeadingShorts" },
    {
      key: "master-card",
      icon: <TeamOutlined />,
      label: "Merchandising",
    },
    // { key: "blog", icon: <CarOutlined />, label: "Blog" },
    // { key: "testinomial", icon: <CalendarOutlined />, label: "Testinomial" },
  ];
  return (
    <Layout style={{ minHeight: "100vh", maxWidth: "100vw" }}>
      <Header className="header">
        <div className="logo-vinMart">
          {/* <img src={logo} alt="dewanRealty Logo" /> */}
          {/* <h1>logo</h1> */}
        </div>

        <Button
          type="primary"
          onClick={handleLogout}
          style={{ marginLeft: "20px" }}
        >
          Logout
        </Button>
      </Header>

      <Layout>
        <Sider className="sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            style={{ height: "100%", borderRight: 0 }}
            onClick={handleMenuClick}
          >
            {/* <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item> */}


            {
              auth1?.user?.role==='superAdmin'?(<>
                  {menuItems1?.map((menuItem) => (
              <Menu.Item key={menuItem?.key} icon={menuItem?.icon}>
                {menuItem?.label}
              </Menu.Item>
            ))}
              </>):(<>
                 
                 {menuItems?.map((menuItem) => (
              <Menu.Item key={menuItem?.key} icon={menuItem?.icon}>
                {menuItem?.label}
              </Menu.Item>
            ))}
              </>)
            }

            
          </Menu>
        </Sider>

        <Layout style={{ padding: "24px" }}>
          <Content className="content">{renderContent()}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
