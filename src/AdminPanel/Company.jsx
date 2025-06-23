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
  InputNumber,
  Popconfirm,
  Space,
  List
} from "antd";

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import {
  BellOutlined,
  TranslationOutlined,
  TruckOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { baseurl } from "../helper/Helper";
import axios from "axios";
import Password from "antd/es/input/Password";
// import { baseurl } from "../helper/Helper";
import { useAuth } from "../context/auth";
import Dragger from "antd/es/upload/Dragger";
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
  const auth1 = JSON.parse(localStorage.getItem('auth'));

  const [search, setSearch] = useState("")
  const [seachloading, setSearchLoading] = useState(false);


  const [selectedCategory, setSelectedCategory] = useState(null); // store in a variable
  const [images, setImages] = useState([]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value); // save selected category ID to variable
    // console.log("Selected Category ID:", value);
  };


  // console.log("images", images)




  const handleRowClick = (record) => {
    // console.log("Clicked row data:", record);
    setRecord(record);
    setImage(record?.logo);
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
    // fetchData();
    fetchData1()


  }, []);


  useEffect(() => {
    fetchData();
  }, [seachloading]);



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
      const res = await axios.get(baseurl + "/getAllCompany");

      console.log("----data-----", res.data);


      if (seachloading) {
        const filtered = res?.data.filter(job => job.websiteName.toLowerCase().includes(search.toLowerCase()));
        setData(filtered);
      } else {
        setData(res?.data);
      }


      // setData(res.data);
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

  const handleChange = (value) => {
    setSearch(value)

    // console.log("----seach----",value)
  }

  const handleAdd = () => {
    setEditingCompany(null);
    form.resetFields();
    setIsModalOpen(true);
    setImages([])
  };

  const handleEdit = (record) => {
    setImageTrue(true);
    setEditingCompany(record);
    // console.log(record);
    setImages(record?.images)
    setSelectedCategory(record.category._id)
    const benifits = record?.benifits?.join('\n')
    const eligibility = record?.eligibility?.join('\n')
    const cons = record?.cons.join('\n')
    const features = record?.features.join('\n')
    const pros = record?.pros.join('\n')
    form.setFieldsValue({
      Description: record?.Description,
      benifits: benifits,
      eligibility: eligibility,
      cons: cons,
      features: features,
      pros: pros,
      mainHeading: record?.mainHeading,
      rating: record?.rating,
      review: record?.review,
      websiteName: record?.websiteName,
      visitSiteUrl: record?.visitSiteUrl,
      category: record?.category?._id,
      slug: record.slug,
      subcategories: record?.subcategories?._id,
      dropDown: record?.dropDown || []

      // dob:record.dateOfBirth,
    });
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (record) => {
    try {
      const response = await axios.patch(
        `${baseurl}/updateCompanyStatus/${record?._id}`
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
      const response = await axios.delete(`${baseurl}/deleteCompany/${record}`)
      if (response) {
        message.success("Status updated succesfully");
        fetchData();
      }
    } catch (error) {
      console.log(error)
    }
  }



  const uploadImage = async (file) => {
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

      return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
    } catch (error) {
      message.error("Error uploading image. Please try again later.");
      console.error("Image upload error:", error);
      return null;
    }
  };
  // const uploadImage = async (file) => {
  //     console.log(file);
  //     const formData = new FormData();
  //     formData.append("image", file.file);
  //     // console.log(file.file.name);

  //     try {
  //       const response = await axios.post(
  //         `${baseurl}/upload`,
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       if (response) {
  //         message.success("Image uploaded successfully!");
  //         setImage(response.data.imageUrl);
  //       }

  //       return response.data.imageUrl; // Assuming the API returns the image URL in the 'url' field
  //     } catch (error) {
  //       message.error("Error uploading image. Please try again later.");
  //       console.error("Image upload error:", error);
  //       return null;
  //     }
  //   };


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

  const handlePost = async (values) => {

    const benifits = values?.benifits.split('\n')
    const eligibility = values?.eligibility.split('\n')
    const cons = values?.cons.split('\n')
    const features = values?.features.split('\n')
    const pros = values?.pros.split('\n')
    const postData = {
      Description: values.Description,
      benifits: benifits,
      eligibility: eligibility,
      cons: cons,
      features: features,
      pros: pros,
      mainHeading: values.mainHeading,
      rating: values.rating,
      review: values.review,
      websiteName: values.websiteName,
      visitSiteUrl: values.visitSiteUrl,
      category: values.category,
      slug: values.slug,
      subcategories: values.subcategories,
      logo: image1,
      dropDown: values.dropDown,
      images: images

    };

    // console.log(postData)

    try {
      const response = await axios.post(
        baseurl + "/createCompany",
        postData
      );
      // console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        message.success("User created successfully!");
        fetchData();
        setImages([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePut = async (values) => {
    const benifits = values?.benifits.split('\n')
    const eligibility = values?.eligibility.split('\n')
    const cons = values?.cons.split('\n')
    const features = values?.features.split('\n')
    const pros = values?.pros.split('\n')
    const postData = {
      Description: values.Description,
      benifits: benifits,
      eligibility: eligibility,
      cons: cons,
      features: features,
      pros: pros,
      mainHeading: values.mainHeading,
      rating: values.rating,
      review: values.review,
      websiteName: values.websiteName,
      visitSiteUrl: values.visitSiteUrl,
      category: values.category,
      slug: values.slug,
      subcategories: values.subcategories,
      logo: imageTrue ? image1 : values.logo,
      dropDown: values.dropDown,
      images: images

    };


    // console.log("----post data----", postData)

    try {
      const response = await axios.put(
        `${baseurl}/updateCompany/${editingCompany?._id}`,
        postData
      );
      // console.log(response.data);

      if (response.data) {
        setIsModalOpen(false);
        fetchData();
        message.success("User update successfully!");
        form.resetFields();
        setImages([]);
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

      <div className="search">
        <Input type="text" value={search} onChange={(e) => { handleChange(e.target.value) }} placeholder="Enter Website Name" />
        <Button onClick={handleSeach}> Search</Button>
        <Button onClick={ClearSeach}> Clear Filter</Button>
      </div>




      {
        auth1?.user?.role === 'superAdmin' ? (<> <Table
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
        /></>) : (<>
          <Table
            columns={columns1}
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
        </>)
      }

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
            name="slug"
            label="Slug"
            rules={[{ required: true, message: "Please Enter slug!" }]}
          >
            <Input placeholder="Enter Slug" />
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
            name="eligibility"
            label="Eligibility"
          // rules={[{ required: true, message: "Please input the review!" }]}
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
                    // rules={[{ required: true, message: "Please enter Head" }]}
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
                                  // { required: true, message: "Please enter a drop item" },
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
                              Add Data
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
                    Add Data Group
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>


{/* image array */}
          <Form.Item label="Upload Icons">
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
          <Form.Item label="Uploaded Icons" >
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






          {editingCompany ? (


            <>
              {cross ? (
                <>
                  <CloseCircleOutlined
                    style={{ width: "30px" }}
                    onClick={handleCross}
                  />
                  {/* <img
                    src={`${baseurl}${record1.logo}`}
                    alt=""
                    style={{ width: "100px", height: "100px" }}
                  /> */}


                  {
                    record1?.logo?.includes("res") ? (
                      <img
                        src={record1.logo}
                        alt=""
                        style={{ width: "100px", height: "100px" }}
                      />
                    ) : (
                      <img
                        src={`${baseurl}${record1.logo}`}
                        alt=""
                        style={{ width: "100px", height: "100px" }}
                      />
                    )
                  }
                </>
              ) : (
                <>
                  <Form.Item
                    label="Logo"
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
                label="Logo"
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
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Company;
