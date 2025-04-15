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
    InputNumber
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
const { Option } = Select;

const { TextArea } = Input;
const CompBlog = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [form] = Form.useForm();
    const [auth, setAuth] = useAuth();
    const [categories, setCategoris] = useState([])
    const [subcategories, setSubCategoris] = useState([])
    const [image1, setImage] = useState();
    const [photo, setPhoto] = useState("");
    const [cross, setCross] = useState(true);
    const [record1, setRecord] = useState();
    const [imageTrue, setImageTrue] = useState(false);
    const[tag,setTag] = useState([])
    const[user,setUser] = useState([])


    const [selectedCategory, setSelectedCategory] = useState(null); // store in a variable

    const handleCategoryChange = (value) => {
        setSelectedCategory(value); // save selected category ID to variable
        console.log("Selected Category ID:", value);
    };





    const handleRowClick = (record) => {
        console.log("Clicked row data:", record);
        setRecord(record);
        setImage(record?.logo);
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
            const res = await axios.get(baseurl + "/getALlcompblogs");

            console.log("----data-----", res.data);
            setData(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingCompany(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setImageTrue(true);
        setEditingCompany(record);
        console.log(record);

       
        form.setFieldsValue({
            title:record.title,
            mtitle:record.mtitle,
            mdesc:record.mdesc,
            category: record.category._id,
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

        const benifits = values?.benifits.split(',')
        const cons = values?.cons.split(',')
        const features = values?.features.split(',')
        const pros = values?.pros.split(',')
        const postData = {
            Description: values.Description,
            benifits: benifits,
            cons: cons,
            features: features,
            pros: pros,
            mainHeading: values.mainHeading,
            rating: values.rating,
            review: values.review,
            websiteName: values.websiteName,
            visitSiteUrl: values.visitSiteUrl,
            category: values.category,
            subcategories: values.subcategories,
            logo: image1,

        };

        console.log(postData)

        try {
            const response = await axios.post(
                baseurl + "/createCompany",
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
        const benifits = values?.benifits.split(',')
        const cons = values?.cons.split(',')
        const features = values?.features.split(',')
        const pros = values?.pros.split(',')
        const postData = {
            Description: values.Description,
            benifits: benifits,
            cons: cons,
            features: features,
            pros: pros,
            mainHeading: values.mainHeading,
            rating: values.rating,
            review: values.review,
            websiteName: values.websiteName,
            visitSiteUrl: values.visitSiteUrl,
            category: values.category,
            subcategories: values.subcategories,
            logo: imageTrue ? image1 : values.logo,

        };


        console.log("----post data----", postData)

        try {
            const response = await axios.put(
                `${baseurl}/updateCompany/${editingCompany?._id}`,
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
        if (editingCompany) {
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
                Add Company
            </Button>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
              
               
            // rowKey="_id"
            />

            <Modal
                title={editingCompany ? "Edit Company" : "Add Company"}
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
                        <Select placeholder="Select a subcategories" loading={loading} >
                            {subcategories.map((cat) => (
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



                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingCompany ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CompBlog;
