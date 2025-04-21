import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Upload,
  Switch,
  DatePicker
} from "antd";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
const { Option } = Select;


const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();

  // console.log(auth?.user._id);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(baseurl + "/getAdmin");

      console.log(res.data);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingUser(record);
    console.log(record.email);
    form.setFieldsValue({
      firstName: record.firstName,
      lastName: record.lastName,
      username: record.username,
      email: record.email,
      role: record.role,
      // password: record.password,
      // dob:record.dateOfBirth,
    });
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (record) => {
    try {
      const response = await axios.patch(
        `${baseurl}/api/admin/toggled/${record?._id}`
      );
      console.log(response);

      if (response) {
        message.success("Status updated succesfully");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePost = async (values) => {
    const postData = {
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      email: values.email,
      role: values.role,
      password:values.password

    };

    try {
      const response = await axios.post(
        baseurl + "/register",
        postData
      );
      console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        message.success("User created successfully!");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePut = async (values) => {
    const postData = {
      firstName: values.firstName,
      lastName: values.lastName,
      username: values.username,
      email: values.email,
      role: values.role,
      password:values.password

    };

    try {
      const response = await axios.put(
        `${baseurl}/update/${editingUser?._id}`,
        postData
      );
      console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        fetchData();
        message.success("User update successfully!");
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async (values) => {
    if (editingUser) {
      await handlePut(values);
    } else {
      await handlePost(values);
    }
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "name",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   key: "phone",
    // },


    // {
    //   title: "Specialization",
    //   dataIndex: "specialization",
    //   key: "specialization",
    // },
    // specialization

    {
      title: "Status",
      key: "Status",
      render: (_, record) => (
        <Switch
          checked={record.Status === "Active"}
          onChange={() => handleStatusToggle(record)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Update</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Admin
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
      // rowKey="_id"
      />

      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please Enter First Name!" }]}
          >
            <Input placeholder="Enter Name" />
          </Form.Item>



          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please Enter Last Name !" }]}
          >
            <Input placeholder="Enter Name" />
          </Form.Item>


          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please Enter Email!" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>




          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please Enter Password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>



          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please Enter UserName !" }]}
          >
            <Input placeholder="Enter UserName" />
          </Form.Item>




          <Form.Item
            name="role"
            rules={[{ required: true, message: "Please Select Role!" }]}
            label="Role"
          >
            <Select placeholder="Select specialization">
              <Option value="admin">Admin</Option>
              <Option value="superAdmin">Super Admin</Option>
              <Option value="seoAdmin">Seo Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>

            <Button type="primary" htmlType="submit">
              {editingUser ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
