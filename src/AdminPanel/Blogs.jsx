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
    Popconfirm,
    Space,
    List
} from "antd";

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Dragger from "antd/es/upload/Dragger";
import {
    BellOutlined,
    TranslationOutlined,
    TruckOutlined,
    CloseCircleOutlined,
    PlusOutlined,
    MinusCircleOutlined,
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
    const auth1 = JSON.parse(localStorage.getItem('auth'));


    const [search, setSearch] = useState("")
    const [seachloading, setSearchLoading] = useState(false);


    const [selectedCategory, setSelectedCategory] = useState(null); // store in a variable
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);


    const [blogType, setBlogType] = useState('');

    const handleChange = (value) => {
        setBlogType(value);
        // console.log("Selected blogType:", value); // Do something with the value
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value); // save selected category ID to variable
        // console.log("Selected Category ID:", value);
    };


    const handleCategoryChange1 = (value) => {
        setSelectedSubCategory(value); // save selected category ID to variable
        // console.log("Selected Category ID:", value);
    };





    const handleRowClick = (record) => {
        console.log("Clicked row data:", record);
        setRecord(record);
        setImage(record?.image)
        setCross(true);
        setImages(record?.images)

        // Access the clicked row's data here
        // You can now use 'record' to get the details of the clicked row
    };

    const handleCross = () => {
        setCross(false);
    };

    // console.log(auth?.user._id);

    useEffect(() => {

        fetchData1()
        fetchData3()
        fetchData4()


    }, []);



    useEffect(() => {
        fetchData();

    }, [seachloading]);



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
            // console.log("----data-----", res.data);
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
            // console.log("----data-----", res.data);
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

            // console.log("----data-----", res.data);
            // setData(res.data);


            if (seachloading) {
                const filtered = res?.data.filter(job => job.title.toLowerCase().includes(search.toLowerCase()));
                setData(filtered);
            } else {
                setData(res?.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };




    const handleSeach = () => {
        setSearchLoading(true)

    }

    const ClearSeach = () => {
        setSearchLoading(false)
        setSearch("")

    }

    // console.log("---loading---",seachloading)

    const handleChange1 = (value) => {
        setSearch(value)

        // console.log("----seach----",value)
    }

    const handleAdd = () => {
        setEditingCompBlog(null);
        form.resetFields();
        setIsModalOpen(true);
        setImages([])
    };

    const handleEdit = (record) => {
        setImageTrue(true);
        setEditingCompBlog(record);
        // console.log(record);
        setSelectedCategory(record.categories._id)
        setSelectedSubCategory(record.subcategories._id)
        setBlogType(record?.blogType)
        setEditorContent(record.body)
        setImages(record?.images)
        const link = record?.link?.join('\n')
        // console.log("--------data-----------", record.categories._id)
        form.setFieldsValue({
            title: record?.title,
            mtitle: record?.mtitle,
            mdesc: record?.mdesc,
            category: record?.categories._id,
            subcategories: record?.subcategories._id,
            tags: record?.tags?._id,
            faqs: record?.faqs || [],
            slug: record?.slug,
            blogType: record?.blogType,
            blogType1: record?.blogType1,
            imageType: record?.imageType,
            conclusion: record?.conclusion,
            link: link,



            // dob:record.dateOfBirth,
        });
        setIsModalOpen(true);
    };

    const handleStatusToggle = async (record) => {
        try {
            const response = await axios.patch(
                `${baseurl}/updateBlogStatus/${record?._id}`
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
            const response = await axios.delete(`${baseurl}/deleteblogs/${record}`)
            if (response) {
                message.success("Status updated succesfully");
                fetchData();


                if (response) {
                    const postData = {
                        blogsToDelete: [record]
                    }

                    const response1 = await axios.patch(
                        `${baseurl}/deleteSpecificuserBLog/${auth1?.user?.id}`,
                        postData
                    );

                    // console.log(response1.data)
                }
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
                `${baseurl}/api/uploadImage`,
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
                toast.success("image uploaded successfully", { position: "bottom-right" });
            }

            return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
        } catch (error) {
            message.error("Error uploading image. Please try again later.");
            console.error("Image upload error:", error);
            return null;
        }
    };


    const [images, setImages] = useState([]);
    // Handle image upload and store URL in state
    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file.file);
        console.log("image", file.file);
        try {
            const response = await axios.post(
                `${baseurl}/api/uploadImage`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.imageUrl) {
                // Store the image URL in the state array
                setImages((prevImages) => [...prevImages, response.data.imageUrl]);
                message.success("Image uploaded successfully!");
            } else {
                message.error("Image upload failed!");
            }
        } catch (error) {
            message.error("Error uploading image!");
        }

        return false; // Prevent default upload behavior
    };

    // console.log("images",images);
    // Remove an image URL from the array
    const removeImage = (url) => {
        setImages((prevImages) => prevImages.filter((image) => image !== url));
    };

    // const uploadImage = async (file) => {
    //     console.log("Uploading file:", file);

    //     const formData = new FormData();

    //     // Use "image" or "video" key based on file type
    //     const isVideo = file.file.type.startsWith("video/");
    //     const fieldName = isVideo ? "video" : "image";

    //     formData.append(fieldName, file.file);

    //     try {
    //         const response = await axios.post(
    //             `${baseurl}/api/uploadImage`, // Change URL if needed
    //             formData,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             }
    //         );

    //         if (response) {
    //             message.success(`${isVideo ? "Video" : "Image"} uploaded successfully!`);
    //             setImage(response.data.imageUrl); // You can keep this as `setImage` if you're using it for both
    //         }

    //         return response.data.imageUrl;
    //     } catch (error) {
    //         message.error(`Error uploading ${isVideo ? "video" : "image"}. Please try again later.`);
    //         console.error("Upload error:", error);
    //         return null;
    //     }
    // };


    // console.log("auth1?.user?._id", auth1?.user)


    const [image11, setImage11] = useState("")
    const uploadImage1 = async (file) => {
        // console.log(file);
        const formData = new FormData();
        formData.append("image", file.file);
        // console.log(file.file.name);

        try {
            const response = await axios.post(
                `${baseurl}/api/uploadImage`,
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
                toast.success("image uploaded successfully", { position: "bottom-right" });
            }

            setImage11(response.data.imageUrl)

            return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
        } catch (error) {
            message.error("Error uploading image. Please try again later.");
            console.error("Image upload error:", error);
            return null;
        }
    };

    const handlePost = async (values) => {


        
    const link = values?.link.split('\n')
        const postData = {
            title: values?.title,
            mtitle: values?.mtitle,
            mdesc: values?.mdesc,
            categories: values?.category,
            subcategories: values?.subcategories,
            tags: values?.tags,
            postedBy: auth1?.user?.id,
            image: image1,
            body: editorContent,
            faqs: values.faqs,
            slug: values.slug,
            blogType: values?.blogType,
            blogType1: values?.blogType1,
            imageType: values?.imageType,
            conclusion: values?.conclusion,
            images: images,
            link:link

        };

        // console.log(postData)

        try {
            const response = await axios.post(
                baseurl + "/blogs",
                postData
            );
            // console.log(response.data);

            if (response.data) {
                setIsModalOpen(false);
                message.success("User created successfully!");
                setPhoto("");
                fetchData();
                setImages([]);
                setEditorContent("")



                if (response?.data?._id) {
                    const postData = {
                        blog: [response?.data?._id]
                    }

                    const response1 = await axios.patch(
                        `${baseurl}/updateUser/${auth1?.user?.id}`,
                        postData
                    );

                    // console.log(response1.data)
                }



            }
        } catch (error) {
            console.log(error);
        }




    };

    const handlePut = async (values) => {
        // console.log("auth1?.user?._id",auth1)
        const link = values?.link.split('\n')
        const postData = {
            title: values?.title,
            mtitle: values?.mtitle,
            mdesc: values?.mdesc,
            categories: values?.category,
            subcategories: values?.subcategories,
            tags: values.tags,
            postedBy: auth1?.user?.id,
            image: imageTrue ? image1 : values.logo,
            body: editorContent,
            faqs: values?.faqs,
            slug: values?.slug,
            blogType: values?.blogType,
            blogType1: values?.blogType1,
            imageType: values?.imageType,
            conclusion: values?.conclusion,
            images: images,
            link:link
        };


        // console.log("----post data----", postData)

        try {
            const response = await axios.put(
                `${baseurl}/updateblogs/${editingCompBlog?._id}`,
                postData
            );
            // console.log(response.data);

            if (response.data) {
                setIsModalOpen(false);
                fetchData();
                message.success("User update successfully!");
                form.resetFields();
                setPhoto("");
                setImages([])
                setEditorContent("")
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

            <div className="search">
                <Input type="text" value={search} onChange={(e) => { handleChange1(e.target.value) }} placeholder="Enter BLog Title" />
                <Button onClick={handleSeach}> Search</Button>
                <Button onClick={ClearSeach}> Clear Filter</Button>
            </div>




            {
                auth1?.user?.role === 'superAdmin' ? (<><Table
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
                        name="slug"
                        label="Blog Slug"
                        rules={[{ required: true, message: "Please input slug!" }]}
                    >
                        <Input placeholder="Enter Blog Slug" />
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


                    {/* <Form.Item
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
                    </Form.Item> */}



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



                    <Form.Item
                        label="Image"
                        name="image11"
                    // onChange={(e) => setPhoto(e.target.files[0])}
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: "Please upload the driver's photo!",
                    //     },
                    // ]}
                    >
                        <Upload
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={uploadImage1}
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
                    {image11 && (
                        <div style={{ marginTop: 10 }}>
                            <p style={{ wordBreak: 'break-all' }}>{`${baseurl}${image11}`}</p>
                            <Button
                                type="primary"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${baseurl}${image11}`);
                                    message.success("Link copied to clipboard!");
                                }}
                            >
                                Copy Link
                            </Button>
                        </div>
                    )}


                    <br />


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
                                        // console.log({ files });
                                        if (files) {
                                            this.selection.insertImage(files.url, null, 250);
                                        }
                                    },
                                },
                                // enter: "DIV",
                                // defaultMode: "DIV",
                                removeButtons: ["font"],
                            }}
                        />
                    </Form.Item>



                    <Form.Item label="FAQS" required>
                        <Form.List name="faqs">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }, index) => (
                                        <Space
                                            key={key}
                                            style={{ display: "flex", marginBottom: 8 }}
                                            align="start"
                                        >
                                            <Form.Item
                                                {...restField}
                                                label={`Q${index + 1}`}
                                                name={[name, "ques"]}
                                                rules={[{ required: true, message: "Please enter a question" }]}
                                            >
                                                <Input placeholder="Question" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                label={`A${index + 1}`}
                                                name={[name, "ans"]}
                                                rules={[{ required: true, message: "Please enter an answer" }]}
                                            >
                                                <Input placeholder="Answer" />
                                            </Form.Item>

                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Add FAQ
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form.Item>






                    <Form.Item
                        name="conclusion"
                        label="Conclusion"
                    // rules={[{ required: true, message: "Please input the conclusion!" }]}
                    >
                        <Input.TextArea placeholder="Enter blog conclusion" rows={4} />
                    </Form.Item>






                    <Form.Item
                        label="Blog Type Blog/Stories"
                        name="blogType1"
                        rules={[{ required: true, message: 'Please select a blog type' }]}
                    >
                        <Select
                            placeholder="Select blog type"
                        // onChange={handleChange}
                        // value={blogType}
                        >
                            <Option value="blog">Blog</Option>
                            <Option value="stories">Stories</Option>
                        </Select>
                    </Form.Item>


                    <Form.Item
                        label="Blog Image Type"
                        name="imageType"
                        rules={[{ required: true, message: 'Please select a blog type' }]}
                    >
                        <Select
                            placeholder="Select blog type"
                        // onChange={handleChange}
                        // value={blogType}
                        >
                            <Option value="imageType">Image</Option>
                            <Option value="storiesType">Video</Option>
                        </Select>
                    </Form.Item>


                    <Form.Item
                        label="Blog Image/Video"
                        name="blogType"
                        rules={[{ required: true, message: 'Please select a blog type' }]}
                    >
                        <Select
                            placeholder="Select blog type"
                            onChange={handleChange}
                            value={blogType}
                        >
                            <Option value="viral stories">Viral Stories</Option>
                            <Option value="article">Article</Option>
                        </Select>
                    </Form.Item>


                    {

                        blogType === 'article' ? (
                            <>
                                {editingCompBlog ? (
                                    <>
                                        {cross ? (
                                            <>
                                                <CloseCircleOutlined
                                                    style={{ width: "30px" }}
                                                    onClick={handleCross}
                                                />
                                                {
                                                    record1?.image?.includes("res") ? (
                                                        <img
                                                            src={record1.image}
                                                            alt=""
                                                            style={{ width: "100px", height: "100px" }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={`${baseurl}${record1.image}`}
                                                            alt=""
                                                            style={{ width: "100px", height: "100px" }}
                                                        />
                                                    )
                                                }
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
                            </>
                        ) : (
                            <>
                                {editingCompBlog ? (
                                    <>
                                        {cross ? (
                                            <>
                                                <CloseCircleOutlined
                                                    style={{ width: "30px" }}
                                                    onClick={handleCross}
                                                />
                                                {
                                                    record1?.image?.includes("res") ? (
                                                        <video
                                                            src={record1.image}
                                                            style={{ width: "200px", height: "120px" }}
                                                            controls
                                                        />
                                                    ) : (
                                                        <video
                                                            src={`${baseurl}${record1.image}`}
                                                            style={{ width: "200px", height: "120px" }}
                                                            controls
                                                        />
                                                    )
                                                }
                                            </>
                                        ) : (
                                            <>
                                                <Form.Item
                                                    label="Video"
                                                    name="photo"
                                                    onChange={(e) => setPhoto(e.target.files[0])}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Please upload a video!",
                                                        },
                                                    ]}
                                                >
                                                    <Upload
                                                        listType="text"
                                                        beforeUpload={() => false}
                                                        onChange={uploadImage}
                                                        showUploadList={false}
                                                        customRequest={({ file, onSuccess }) => {
                                                            setTimeout(() => {
                                                                onSuccess("ok");
                                                            }, 0);
                                                        }}
                                                    >
                                                        <Button icon={<UploadOutlined />}>Upload Video</Button>
                                                    </Upload>
                                                </Form.Item>
                                                {photo && (
                                                    <div>
                                                        <video width="320" height="240" controls>
                                                            <source src={URL.createObjectURL(photo)} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Form.Item
                                            label="Video"
                                            name="photo"
                                            onChange={(e) => setPhoto(e.target.files[0])}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please upload a video!",
                                                },
                                            ]}
                                        >
                                            <Upload
                                                listType="text"
                                                beforeUpload={() => false}
                                                onChange={uploadImage}
                                                showUploadList={false}
                                                customRequest={({ file, onSuccess }) => {
                                                    setTimeout(() => {
                                                        onSuccess("ok");
                                                    }, 0);
                                                }}
                                            >
                                                <Button icon={<UploadOutlined />}>Upload Video</Button>
                                            </Upload>
                                        </Form.Item>
                                        {photo && (
                                            <div>
                                                <video width="320" height="240" controls>
                                                    <source src={URL.createObjectURL(photo)} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )
                    }










                    {/* {editingCompBlog ? (
                        <>
                            {cross ? (
                                <>
                                    <CloseCircleOutlined
                                        style={{ width: "30px" }}
                                        onClick={handleCross}
                                    />




                                     {
                                                                            record1?.image?.includes("res") ? (
                                                                                <img
                                                                                    src={record1.image}
                                                                                    alt=""
                                                                                    style={{ width: "100px", height: "100px" }}
                                                                                />
                                                                            ) : (
                                                                                <img
                                                                                    src={`${baseurl}${record1.image}`}
                                                                                    alt=""
                                                                                    style={{ width: "100px", height: "100px" }}
                                                                                />
                                                                            )
                                                                        }
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
                    )} */}


                    {/* image array */}
                    <Form.Item label="Popup Images Both for Desktop and Mobile">
                        <Dragger
                            name="file"
                            customRequest={handleUpload}
                            showUploadList={false}
                            multiple={true}
                        >
                            <div>
                                <PlusOutlined />
                                <div>Click or drag to upload images</div>
                            </div>
                        </Dragger>
                    </Form.Item>

                    {/* Display Uploaded Images */}
                    <Form.Item label="Uploaded Popup Images " >
                        <List
                            itemLayout="horizontal"
                            dataSource={images}
                            renderItem={(imageUrl) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => removeImage(imageUrl)}
                                            danger
                                        >
                                            Remove
                                        </Button>,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={
                                            <img
                                                src={`${baseurl}${imageUrl}`}
                                                alt="Image Preview"
                                                style={{ maxWidth: "100px", maxHeight: "100px" }}
                                            />
                                        }
                                    // description={imageUrl}
                                    />
                                </List.Item>
                            )}
                        />
                    </Form.Item>


                            <Form.Item
                                name="link"
                                label="Link"
                              // rules={[{ required: true, message: "Please input the review!" }]}
                              >
                                <TextArea placeholder="Enter Link ," style={{ height: 150 }} />
                              </Form.Item>




                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingCompBlog ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />

        </div>
    );
};

export default Blogs;
