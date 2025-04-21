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
    DatePicker,
    InputNumber,
    Popconfirm
} from "antd";

import {
    BellOutlined,
    TranslationOutlined,
    TruckOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
import JoditEditor from "jodit-react";
const { Option } = Select;

const { TextArea } = Input;
const Blogs = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompBlog, setEditingCompBlog] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const [categories, setCategoris] = useState([])
    const [subcategories, setSubCategoris] = useState([])
    const [company, setCompany] = useState([])
    const [image1, setImage] = useState();
    const [photo, setPhoto] = useState("");
    const [cross, setCross] = useState(true);
    const [record1, setRecord] = useState();
    const [imageTrue, setImageTrue] = useState(false);
    const [tag, setTag] = useState([])
    const [user, setUser] = useState([])
    const editor = useRef(null);
    const [editorContent, setEditorContent] = useState("");


    const [selectedCategory, setSelectedCategory] = useState(null); // store in a variable
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const handleCategoryChange = (value) => {
        setSelectedCategory(value); // save selected category ID to variable
        console.log("Selected Category ID:", value);
    };


    const handleCategoryChange1 = (value) => {
        setSelectedSubCategory(value); // save selected category ID to variable
        console.log("Selected Category ID:", value);
    };





    const handleRowClick = (record) => {
        console.log("Clicked row data:", record);
        setRecord(record);
        setImage(record?.image)
        setCross(true);

        // Access the clicked row's data here
        // You can now use 'record' to get the details of the clicked row
    };

    const handleCross = () => {
        setCross(false);
    };

    // console.log(auth?.user._id);

    useEffect(() => {
        fetchData();
        fetchData1()
        fetchData3()
        fetchData4()


    }, []);



    useEffect(() => {
        fetchData2()
    }, [selectedCategory])


    useEffect(() => {
        fetchData6()
    }, [selectedSubCategory])




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
            const res = await axios.get(`${baseurl}/getOneSubByCategoryId/${selectedCategory}`);
            console.log("----data-----", res.data);
            setSubCategoris(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };


    const fetchData6 = async () => {
        try {
            const res = await axios.get(`${baseurl}/getCompanySubId/${selectedSubCategory}`);
            console.log("----data-----", res.data);
            setCompany(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };


    const fetchData3 = async () => {
        try {
            const res = await axios.get(baseurl + "/tags");
            // console.log("----data-----", res.data);
            setTag(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };




    const fetchData4 = async () => {
        try {
            const res = await axios.get(baseurl + "/getUsers");
            // console.log("----data-----", res.data);
            setUser(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };





    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/blogs");

            console.log("----data-----", res.data);
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCompBlog(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setImageTrue(true);
        setEditingCompBlog(record);
        console.log(record);
        setSelectedCategory(record.categories._id)
        setSelectedSubCategory(record.subcategories._id)
        setEditorContent(record.body)
        console.log("--------data-----------", record.categories._id)
        form.setFieldsValue({
            title: record.title,
            mtitle: record.mtitle,
            mdesc: record.mdesc,
            category: record.categories._id,
            subcategories: record.subcategories._id,
            tags: record.tags._id,
            postedBy: record.postedBy._id,


            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/updateBlogStatus/${record?._id}`
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


     const handleDelete = async(record)=>{
                try {
                     const response = await axios.delete(`${baseurl}/deleteblogs/${record}`)
                     if (response) {
                        message.success("Status updated succesfully");
                        fetchData();
                    }
                } catch (error) {
                    console.log(error)
                }
            }



    const uploadImage = async (file) => {
        console.log(file);
        const formData = new FormData();
        formData.append("image", file.file);
        // console.log(file.file.name);

        try {
            const response = await axios.post(
                `${baseurl}/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response) {
                message.success("Image uploaded successfully!");
                setImage(response.data.imageUrl);
            }

            return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
        } catch (error) {
            message.error("Error uploading image. Please try again later.");
            console.error("Image upload error:", error);
            return null;
        }
    };

    const handlePost = async (values) => {


        const postData = {
            title: values.title,
            mtitle: values.mtitle,
            mdesc: values.mdesc,
            categories: values.category,
            subcategories: values.subcategories,
            tags: values.tags,
            postedBy: values.postedBy,
            image: image1,
            body: editorContent,

        };

        console.log(postData)

        try {
            const response = await axios.post(
                baseurl + "/blogs",
                postData
            );
            console.log(response.data);

            if (response.data) {
                setIsModalOpen(false);
                message.success("User created successfully!");
                setPhoto("");
                fetchData();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePut = async (values) => {

        const postData = {
            title: values.title,
            mtitle: values.mtitle,
            mdesc: values.mdesc,
            categories: values.category,
            subcategories: values.subcategories,
            tags: values.tags,
            postedBy: values.postedBy,
            image: imageTrue ? image1 : values.logo,
            body: editorContent,

        };


        console.log("----post data----", postData)

        try {
            const response = await axios.put(
                `${baseurl}/updateblogs/${editingCompBlog?._id}`,
                postData
            );
            console.log(response.data);

            if (response.data) {
                setIsModalOpen(false);
                fetchData();
                message.success("User update successfully!");
                form.resetFields();
                setPhoto("");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async (values) => {
        if (editingCompBlog) {
            await handlePut(values);
        } else {
            await handlePost(values);
        }
    };

    const columns = [
        {
            title: "Blog Title",
            dataIndex: "title",
            key: "title",
        },

        {
            title: "Categories",
            dataIndex: ['categories', 'name'],
            key: "name",
        },

        {
            title: "Subcategories",
            dataIndex: ['subcategories', 'name'],
            key: "subcategories",
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
                    {auth?.user?.role === 'superAdmin' && (
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
            title: "Blog Title",
            dataIndex: "title",
            key: "title",
        },

        {
            title: "Categories",
            dataIndex: ['categories', 'name'],
            key: "name",
        },

        {
            title: "Subcategories",
            dataIndex: ['subcategories', 'name'],
            key: "subcategories",
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
                Add Blog
            </Button>




            {
                auth?.user?.role === 'superAdmin' ? (<><Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    rowKey={(record) => record._id}
                    onRow={(record) => ({
                        onClick: () => {
                            handleRowClick(record); // Trigger the click handler
                        },
                    })}

                />
                </>) : (<>
                    <Table
                        columns={columns1}
                        dataSource={data}
                        loading={loading}
                        rowKey={(record) => record._id}
                        onRow={(record) => ({
                            onClick: () => {
                                handleRowClick(record); // Trigger the click handler
                            },
                        })}

                    />

                </>)
            }

            <Modal
                title={editingCompBlog ? "Edit CompBlog" : "Add CompBlog"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>


                    <Form.Item
                        name="title"
                        label="Blog Title"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Blog Title" />
                    </Form.Item>


                    <Form.Item
                        name="mtitle"
                        label="Blog Meta Title"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Blog Meta Title" />
                    </Form.Item>


                    <Form.Item
                        name="mdesc"
                        label="Blog Meta Description"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Blog Meta Description" />
                    </Form.Item>


                    <Form.Item
                        name="category"
                        label="Category"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a category" loading={loading} onChange={handleCategoryChange}>
                            {categories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>



                    {/* {
                    subcategories.length !==0?(<> <Form.Item
                        name="subcategories"
                        label="SubCategories"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a subcategories" loading={loading} >
                            {subcategories.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item></>):"No SubCategory Found"
                } */}


                    <Form.Item
                        name="subcategories"
                        label="SubCategories"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a subcategories" loading={loading} onChange={handleCategoryChange1}>
                            {subcategories?.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        name="postedBy"
                        label="Author"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a Author" loading={loading} >
                            {user.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.firstName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>



                    <Form.Item
                        name="tags"
                        label="Tags"
                        rules={[{ required: true, message: 'Please select a category!' }]}
                    >
                        <Select placeholder="Select a Tag" loading={loading} >
                            {tag.map((cat) => (
                                <Option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item label="Content" required>
                        <JoditEditor
                            ref={editor}
                            value={editorContent}
                            onBlur={(newContent) => setEditorContent(newContent)}
                            tabIndex={1}
                            placeholder="Write your content here..."
                            config={{
                                cleanHTML: {
                                    removeEmptyTags: false,
                                    fillEmptyParagraph: false,
                                    removeEmptyBlocks: false,
                                },
                                uploader: {
                                    url: `${baseurl}/api/amenities/uploadImage`, // Your image upload API endpoint
                                    // This function handles the response
                                    format: "json", // Specify the response format
                                    isSuccess: function (resp) {
                                        return !resp.error;
                                    },
                                    getMsg: function (resp) {
                                        return resp.msg.join !== undefined
                                            ? resp.msg.join(" ")
                                            : resp.msg;
                                    },
                                    process: function (resp) {
                                        return {
                                            files: resp.files || [],
                                            path: resp.files.url,
                                            baseurl: resp.files.url,
                                            error: resp.error || "error",
                                            msg: resp.msg || "iuplfn",
                                        };
                                    },
                                    defaultHandlerSuccess: function (data, resp) {
                                        const files = data.files || [];
                                        console.log({ files });
                                        if (files) {
                                            this.selection.insertImage(files.url, null, 250);
                                        }
                                    },
                                },
                                enter: "DIV",
                                defaultMode: "DIV",
                                removeButtons: ["font"],
                            }}
                        />
                    </Form.Item>



                    {editingCompBlog ? (
                        <>
                            {cross ? (
                                <>
                                    <CloseCircleOutlined
                                        style={{ width: "30px" }}
                                        onClick={handleCross}
                                    />
                                    <img
                                        src={`${record1.image}`}
                                        alt=""
                                        style={{ width: "100px", height: "100px" }}
                                    />
                                </>
                            ) : (
                                <>
                                    <Form.Item
                                        label="Photo"
                                        name="photo"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please upload the driver's photo!",
                                            },
                                        ]}
                                    >
                                        <Upload
                                            listType="picture"
                                            beforeUpload={() => false}
                                            onChange={uploadImage}
                                            showUploadList={false}
                                            customRequest={({ file, onSuccess }) => {
                                                setTimeout(() => {
                                                    onSuccess("ok");
                                                }, 0);
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />}>Upload Photo</Button>
                                        </Upload>
                                    </Form.Item>
                                    {photo && (
                                        <div>
                                            <img
                                                src={URL.createObjectURL(photo)}
                                                alt="Uploaded"
                                                height="100px"
                                                width="100px"
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Form.Item
                                label="Photo"
                                name="photo"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please upload the driver's photo!",
                                    },
                                ]}
                            >
                                <Upload
                                    listType="picture"
                                    beforeUpload={() => false}
                                    onChange={uploadImage}
                                    showUploadList={false}
                                    customRequest={({ file, onSuccess }) => {
                                        setTimeout(() => {
                                            onSuccess("ok");
                                        }, 0);
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Upload Photo</Button>
                                </Upload>
                            </Form.Item>
                            {photo && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Uploaded"
                                        height="100px"
                                        width="100px"
                                    />
                                </div>
                            )}
                        </>
                    )}




                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingCompBlog ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Blogs;
