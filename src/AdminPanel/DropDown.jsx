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
    DatePicker,
    Popconfirm,
    Space
} from "antd";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
const { Option } = Select;


const DropDown = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const [categories, setCategoris] = useState([])
    const [subcategories, setSubCategoris] = useState([])
    const auth1 = JSON.parse(localStorage.getItem('auth'));
    // console.log(auth?.user._id);

    useEffect(() => {
        fetchData();
        fetchData1()
        fetchData2()
    }, []);




    const fetchData1 = async () => {
        try {
            const res = await axios.get(baseurl + "/category");
            // console.log("----data-----", res.data);
            setCategoris(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };


      const fetchData2 = async () => {
        try {
            const res = await axios.get(baseurl + "/getAllSubcategory");

            // console.log("----data-----", res.data);
            setSubCategoris(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/api/dropDown/getAllDropDown");

            console.log("----data-----", res.data);
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingSubCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingSubCategory(record);
        // console.log(record.email);
        form.setFieldsValue({
            category: record?.category?._id,
            subcategory: record?.subcategory?._id,
            dropDown: record?.dropDown || []
            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/api/dropDown/updateDropDownStatus/${record?._id}`
            );
            // console.log(response);

            if (response) {
                message.success("Status updated succesfully");
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleDelete = async (record) => {
        try {
            const response = await axios.delete(`${baseurl}/api/dropDown/deleteDropDown/${record}`)
            if (response) {
                message.success("Status updated succesfully");
                fetchData();
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handlePost = async (values) => {
        const postData = {
            
            category: values.category,
            dropDown: values.dropDown,
            subcategory: values.subcategory,


        };

        try {
            const response = await axios.post(
                baseurl + "/api/dropDown/createDropDown",
                postData
            );
            // console.log(response.data);

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
            category: values.category,
            dropDown: values.dropDown,
            subcategory: values.subcategory,
        };

        try {
            const response = await axios.put(
                `${baseurl}/api/dropDown/updateDropDown/${editingSubCategory?._id}`,
                postData
            );
            // console.log(response.data);

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
        if (editingSubCategory) {
            await handlePut(values);
        } else {
            await handlePost(values);
        }
    };

    const columns = [
        



        {
            title: "Categories",
            dataIndex: ['category', 'name'],
            key: "name",
        },




        // specialization

        {
            title: "Status",
            key: "Status",
            render: (_, record) => (
                <Switch
                    checked={record.status === "Active"}
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


        {
            title: "Delete",
            render: (_, record) => (
                <>
                    {auth1?.user?.role === 'superAdmin' && (
                        <Popconfirm
                            title="Are you sure you want to delete this blog?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="link" danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    )}
                </>
            ),
        }
    ];


    const columns1 = [
        

        {
            title: "Categories",
            dataIndex: ['category', 'name'],
            key: "name",
        },




        // specialization

        // {
        //   title: "Status",
        //   key: "Status",
        //   render: (_, record) => (
        //     <Switch
        //       checked={record.Status === "Active"}
        //       onChange={() => handleStatusToggle(record)}
        //       checkedChildren="Active"
        //       unCheckedChildren="Inactive"
        //     />
        //   ),
        // },

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
                Add DropDown
            </Button>



            {
                auth1?.user?.role === 'superAdmin' ? (<>            <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    scroll={{ x: 'max-content' }}
                // rowKey="_id"
                /></>) : (<>
                    <Table
                        columns={columns1}
                        dataSource={data}
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                    // rowKey="_id"
                    />
                </>)
            }

            <Modal
                title={editingSubCategory ? "Edit DropDown" : "Add DropDown"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>

                    

                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a category" loading={loading}>
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="subcategory"
                        label="Subcategory"
                        rules={[{ required: true, message: 'Please select a subcategory!' }]}
                    >
                        <Select placeholder="Select a category" loading={loading}>
                            {subcategories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>




                     {/* 🆕 DropDown List UI */}
<Form.List name="dropDown">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, ...restField }) => (
        <div
          key={key}
          style={{
            marginBottom: 16,
            padding: 16,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <Form.Item
            {...restField}
            name={[name, "Head"]}
            label="Head"
            rules={[{ required: true, message: "Please enter Head" }]}
          >
            <Input placeholder="Enter Head" />
          </Form.Item>

          {/* Nested drop Form.List */}
          <Form.List name={[name, "drop"]}>
            {(dropFields, { add: addDrop, remove: removeDrop }) => (
              <>
                {dropFields.map(({ key: dropKey, name: dropName, fieldKey }) => (
                  <Space
                    key={dropKey}
                    // style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      name={dropName}
                      fieldKey={fieldKey}
                      rules={[
                        { required: true, message: "Please enter a drop item" },
                      ]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="Enter Drop item" />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => removeDrop(dropName)}
                      style={{ color: "red" }}
                    />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => addDrop()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Drop Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Button
            danger
            onClick={() => remove(name)}
            icon={<MinusCircleOutlined />}
            style={{ marginTop: 10 }}
          >
            Remove Group
          </Button>
        </div>
      ))}

      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add()}
          block
          icon={<PlusOutlined />}
        >
          Add DropDown Group
        </Button>
      </Form.Item>
    </>
  )}
</Form.List>;









                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingSubCategory ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DropDown;
