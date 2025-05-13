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
import axios from "axios";
import Password from "antd/es/input/Password";
import {
  BellOutlined,
  TranslationOutlined,
  TruckOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
import JoditEditor from "jodit-react";
const { Option } = Select;


const Users = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [auth, setAuth] = useAuth();
  const [image1, setImage] = useState();
      const [photo, setPhoto] = useState("");
      const [cross, setCross] = useState(true);
      const [record1, setRecord] = useState();
      const [imageTrue, setImageTrue] = useState(false);
     const editor = useRef(null);
      const [editorContent, setEditorContent] = useState("");

  // console.log(auth?.user._id);



  // const config = {
  //   readonly: false,
  //   height: 500,
  //   uploader: {
  //     url: `${baseurl}/api/media`, // Image upload API endpoint
  //     method: 'POST',
  //     prepareData: (formData, file) => {
        
  //       if (!file) {
  //         console.error("No file selected!");
  //       }
  //       formData.append('file', file); // Append the file to FormData under 'file' key
  //       return formData;
  //     },
  //     isSuccess: (resp) => {
  //       return resp.success === 1; // Check for success in response
  //     },
  //     getMessage: (resp) => {
  //       return resp.message || 'Image uploaded'; // Success message
  //     },
  //     process: (resp) => {
  //       return {
  //         files: [
  //           {
  //             url: `${baseurl}${resp.file.url}`, // Full URL for the uploaded image
  //           },
  //         ],
  //         path: resp.file.url, // Path to the image (relative to server)
  //       };
  //     },
  //   },
  //   buttons: [
  //     'source', '|',
  //     'bold', 'italic', 'underline', '|',
  //     'ul', 'ol', '|',
  //     'table', 'image', 'video', '|',
  //     'link', 'unlink', '|',
  //     'hr', 'eraser', '|',
  //     'fullsize',
  //   ],
  // };



  const config = {
    readonly: false,
    height: 500,
   uploader: {
  url: `${baseurl}/api/media`,
  method: 'POST',
  data: function (formData) {
    const file = formData.getAll('files[0]')[0];
    console.log(file)
    formData.delete('files[0]');
    formData.append('file', file); // rename field
    console.log("form data",formData)

    const newForm = new FormData()
    newForm.append("file[0]",formData.file[0])
    return formData;

    
  },
  
  isSuccess: (resp) => resp.success === 1,
  getMessage: (resp) => resp.message || 'Image uploaded',
  process: (resp) => ({
    files: [
      {
        url: `${baseurl}${resp.file.url}`,
      },
    ],
    path: resp.file.url,
  }),
},

    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'table', 'image', 'video', '|',
      'link', 'unlink', '|',
      'hr', 'eraser', '|',
      'fullsize',
    ],
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
    setImageTrue(true);
    setEditorContent(record?.shortBio)
    form.setFieldsValue({
      firstName: record?.firstName,
      lastName: record?.lastName,
      username: record?.username,
      email: record?.email,
      role: record?.role,
      socialMedia: {
        facebook: record?.socialMedia?.facebook || '',
        linkedin: record?.socialMedia?.linkedin || '',
        twitter: record?.socialMedia?.twitter || '',
        profile: record?.socialMedia?.profile || '',
      },
      tag:record?.tag,
      slug:record?.slug,
    });

    setIsModalOpen(true);
  };

  const handleStatusToggle = async (record) => {
    try {
      const response = await axios.patch(
        `${baseurl}/updateUserStatus/${record?._id}`
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
    const postData = {
      firstName: values?.firstName,
      lastName: values?.lastName,
      username: values?.username,
      email: values?.email,
      role: values?.role,
      password: values?.password,
      socialMedia: {
        facebook: values?.socialMedia?.facebook || '',
        linkedin: values?.socialMedia?.linkedin || '',
        twitter: values?.socialMedia?.twitter || '',
        profile: values?.socialMedia?.profile || '',
      },
      shortBio:editorContent,
      tag:values?.tag,
      slug:values?.slug,
      image: image1,
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
        setPhoto("");
        setEditorContent("")
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
      socialMedia: {
        facebook: values.socialMedia?.facebook || '',
        linkedin: values.socialMedia?.linkedin || '',
        twitter: values.socialMedia?.twitter || '',
        profile: values.socialMedia?.profile || '',
      },
      shortBio:editorContent,
      slug:values.slug,
      tag:values.tag,
      image: imageTrue ? image1 : values.logo,
    };


    try {
      const response = await axios.patch(
        `${baseurl}/updateUser/${editingUser?._id}`,
        postData
      );
      console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        fetchData();
        message.success("User update successfully!");
        form.resetFields();
        setPhoto("");
        setEditorContent("")
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
        rowKey={(record) => record._id}
                    onRow={(record) => ({
                        onClick: () => {
                            handleRowClick(record); // Trigger the click handler
                        },
                    })}
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



          {
            !editingUser ? (<Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please Enter Password!" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            ) : ("")
          }



          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please Enter UserName !" }]}
          >
            <Input placeholder="Enter UserName" />
          </Form.Item>


          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please Enter slug !" }]}
          >
            <Input placeholder="Enter slug like " />
          </Form.Item>


          <Form.Item
            name="tag"
            label="Tag"
            rules={[{ required: true, message: "Please Enter tag !" }]}
          >
            <Input placeholder="Enter tag like Finance and Travel " />
          </Form.Item>


          {/* <Form.Item
            name="shortBio"
            label="Short Bio"
            rules={[{ required: true, message: "Please Enter tag !" }]}
          >
            <Input placeholder="Enter tag like Finance and Travel " />
          </Form.Item> */}




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



            <Form.Item
              label="Facebook"
              name={['socialMedia', 'facebook']}
              rules={[{ type: 'url', message: 'Enter a valid URL' }]}
            >
              <Input placeholder="https://facebook.com/yourprofile" />
            </Form.Item>

            <Form.Item
              label="LinkedIn"
              name={['socialMedia', 'linkedin']}
              rules={[{ type: 'url', message: 'Enter a valid URL' }]}
            >
              <Input placeholder="https://linkedin.com/in/yourprofile" />
            </Form.Item>

            <Form.Item
              label="Twitter"
              name={['socialMedia', 'twitter']}
              rules={[{ type: 'url', message: 'Enter a valid URL' }]}
            >
              <Input placeholder="https://twitter.com/yourprofile" />
            </Form.Item>

            <Form.Item
              label="Personal Website"
              name={['socialMedia', 'profile']}
              rules={[{ type: 'url', message: 'Enter a valid URL' }]}
            >
              <Input placeholder="https://yourwebsite.com" />
            </Form.Item>




            <Form.Item label="Short Bio" required>
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
                                // enter: "DIV",
                                defaultMode: "div",
                                removeButtons: ["font"],
                            }}
                        />


        
                    </Form.Item>


{/* 
        <Form.Item label="Short Bio" required>            
        <JoditEditor
        ref={editor}
        value={editorContent}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setEditorContent(newContent)}
      />
      </Form.Item> */}



                    {editingUser ? (
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
