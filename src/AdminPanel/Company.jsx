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
const Company = () => {
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

       
    }, []);



    useEffect(()=>{
        fetchData2()
    },[selectedCategory])




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

    const fetchData = async () => {
        try {
            const res = await axios.get(baseurl + "/getAllCompany");

            // console.log("----data-----", res.data);
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
        setSelectedCategory(record.category._id)
        const benifits = record?.benifits.join(',')
        const cons = record?.cons.join(',')
        const features = record?.features.join(',')
        const pros = record?.pros.join(',')
        form.setFieldsValue({
            Description: record.Description,
            benifits: benifits,
            cons: cons,
            features: features,
            pros: pros,
            mainHeading: record.mainHeading,
            rating: record.rating,
            review: record.review,
            websiteName: record.websiteName,
            visitSiteUrl: record.visitSiteUrl,
            category: record.category._id,
            subcategories: record.subcategories._id

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
   

        console.log("----post data----",postData)

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
            title: "Company Name",
            dataIndex: "websiteName",
            key: "websiteName",
        },

        {
            title: "Categories",
            dataIndex: ['category', 'name'],
            key: "name",
        },

        {
            title: "subcategories",
            dataIndex: ['subcategories', 'name'],
            key: "subcategories",
        },


        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
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
                scroll={{ x: 'max-content' }}
                rowKey={(record) => record._id}
         onRow={(record) => ({
          onClick: () => {
            handleRowClick(record); // Trigger the click handler
          },
        })}
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
                        name="websiteName"
                        label="Company Name"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Company Name" />
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
                        name="rating"
                        label="Rating"
                        rules={[{ required: true, message: "Please input the rating!" }]}
                    >
                        <InputNumber min={0} max={5} step={1} placeholder="Enter company rating maximum 5" />
                    </Form.Item>


                    <Form.Item
                        name="visitSiteUrl"
                        label="Company Url"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Company url" />
                    </Form.Item>
                   

                    <Form.Item
                        name="mainHeading"
                        label="Main Heading"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Main Heading" />
                    </Form.Item>


                   


                    <Form.Item
                        name="features"
                        label="Features"
                        rules={[{ required: true, message: "Please input the review!" }]}
                    >
                        <TextArea placeholder="Enter company Feature seperated by comma ," style={{ height: 150 }} />
                    </Form.Item>



                    
                    


                    <Form.Item
                        name="benifits"
                        label="Benefits"
                        rules={[{ required: true, message: "Please input the review!" }]}
                    >
                        <TextArea placeholder="Enter Benifits seperated with comma ," style={{ height: 150 }} />
                    </Form.Item>

               
                    <Form.Item
                        name="Description"
                        label="Description"
                        rules={[{ required: true, message: "Please input the name!" }]}
                    >
                        <Input placeholder="Enter Description" />
                    </Form.Item>


                    <Form.Item
                        name="pros"
                        label="Pros"
                        rules={[{ required: true, message: "Please input the review!" }]}
                    >
                        <TextArea placeholder="Enter Pros seperated with comma ," style={{ height: 150 }} />
                    </Form.Item>

                    <Form.Item
                        name="cons"
                        label="Cons"
                        rules={[{ required: true, message: "Please input the review!" }]}
                    >
                        <TextArea placeholder="Enter Cons seperated with comma ," style={{ height: 150 }} />
                    </Form.Item>


                    <Form.Item
                        name="review"
                        label="Review"
                        rules={[{ required: true, message: "Please input the review!" }]}
                    >
                        <TextArea placeholder="Enter company review" style={{ height: 150 }} />
                    </Form.Item>

                  




                  
          {editingCompany ? (
            <>
              {cross ? (
                <>
                  <CloseCircleOutlined
                    style={{ width: "30px" }}
                    onClick={handleCross}
                  />
                  <img
                    src={`${record1.logo}`}
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
                            {editingCompany ? "Update" : "Submit"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Company;
