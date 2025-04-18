import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Button, Dropdown } from "antd";
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
// import logo from "../../public/logo.png";
// properties-details

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  const [id, setId] = useState();
  const navigate = useNavigate();

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

        case "sub-categories":
        return <SubCategory />;


        case "company":
        return <Company />;


        case "compBlog":
        return <CompBlog />;


        case "blogs":
          return <Blogs />;


      case "blog":
        return <BlogList setSelectedTab={setSelectedTab} />;

      case "testinomial":
        return <Testinomial />;
      case "blog-post":
        return <BlogPosting setSelectedTab={setSelectedTab} />;

      // BlogList
    }
  };

  const menuItems = [
    // { key: "home", icon: <TeamOutlined />, label: "Home" },
    { key: "users", icon: < UserOutlined/>, label: "Users" },
    { key: "categories", icon: <HomeOutlined />, label: "Categories" },
    { key: "sub-categories", icon: <TeamOutlined  />, label: "Sub-Categories" },
    { key: "company", icon: <TeamOutlined  />, label: "Company" },
    { key: "compBlog", icon: <TeamOutlined  />, label: "CompBlog" },
    { key: "blogs", icon: <TeamOutlined  />, label: "Blogs" },
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

            {menuItems?.map((menuItem) => (
              <Menu.Item key={menuItem?.key} icon={menuItem?.icon}>
                {menuItem?.label}
              </Menu.Item>
            ))}
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
