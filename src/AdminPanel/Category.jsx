import React, { useState, useEffect, useRef } from "react";
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
import JoditEditor from "jodit-react";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
const { Option } = Select;


const Category = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();


    const editor = useRef(null);

    const [content,setContent] = useState("")
    const [editorContent, setEditorContent] = useState("");


    const config = {
        readonly: false,
        toolbar: true,
        buttons: [
            'source', '|',
            'bold', 'italic', 'underline', '|',
            'ul', 'ol', '|',
            'table', '|',
            'link', 'image', '|',
            'undo', 'redo'
        ],
        uploader: {
            insertImageAsBase64URI: false,
            url: "http://localhost:5000/upload",
            format: "json",
            method: "POST",
            filesVariableName: () => "image",
            isSuccess: (resp) => resp.imageUrl,
            getMessage: (resp) => resp.error || "Upload failed",
            process: (resp) => ({
                files: [resp.imageUrl],
                path: resp.imageUrl,
                baseurl: "",
                error: false,
                message: "OK"
            })
        }
    };

    // console.log(auth?.user._id);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/category");

            console.log("----data-----", res.data);
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingCategory(record);
        console.log(record.email);
        form.setFieldsValue({
            name: record.name,


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
            name: values.name,

        };

        try {
            const response = await axios.post(
                baseurl + "/category",
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
            name: values.name,
        };

        try {
            const response = await axios.put(
                `${baseurl}/updateCategroy/${editingCategory?._id}`,
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
        if (editingCategory) {
            await handlePut(values);
        } else {
            await handlePost(values);
        }
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        // {
        //     title: "Title",
        //     dataIndex: "title",
        //     key: "title",
        // },

        // {
        //     title: "Description",
        //     dataIndex: "para",
        //     key: "para",
        // },


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
                Add Category
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
            // rowKey="_id"
            />

            <Modal
                title={editingCategory ? "Edit Category" : "Add Category"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Name" />
                    </Form.Item>
                    {/* <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please enter your Title!" }]}
                    >
                        <Input placeholder="Title" />
                    </Form.Item> */}


                    {/* <Form.Item
                        name="para"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter your Description!' }]}
                    >
                        <Input.TextArea
                            placeholder="Description"
                            style={{ height: 200, resize: 'none' }} // You can change 'resize' if needed
                        />
                    </Form.Item> */}


                    {/* <Form.Item label="Content" required>
                        <JoditEditor
                            ref={editor}
                            value={editorContent}
                            config={config}
                            onChange={(newContent) => setEditorContent(newContent)}
                        />
                    </Form.Item> */}







                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingCategory ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Category;
