import React, { useState, useEffect } from 'react';
import {
  Table, Button, Modal, Upload, message, Form, Input, Popconfirm
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { baseurl } from '../helper/Helper';

const WebStoryCrud = () => {
  const [stories, setStories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchStories = async () => {
    const { data } = await axios.get(baseurl+'/api/webstories');
    setStories(data);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append('webstory', file);
    setUploading(true);
    try {
      await axios.post(baseurl+'/api/upload-webstory', formData);
      message.success('Uploaded!');
      fetchStories();
    } catch (err) {
      message.error('Upload failed');
    }
    setUploading(false);
  };

  const handleEdit = (record) => {
    setEditing(record);
    setModalOpen(true);
    form.setFieldsValue({ name: record.name });
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`${baseurl}/api/webstories/${editing._id}`, values);
      message.success('Updated successfully!');
      fetchStories();
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${baseurl}/api/webstories/${id}`);
    message.success('Deleted');
    fetchStories();
  };

  const columns = [
   
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'HTML File',
      dataIndex: 'htmlFile',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          {/* <Button size="small" onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>Edit</Button> */}
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
            <Button danger size="small">Delete</Button>
          </Popconfirm>
          <a
            href={`https://top5shots.com/webstories/${record.name}/${record.htmlFile}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="small" type="link">View</Button>
          </a>
        </>
      )
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Upload
          accept=".zip"
          showUploadList={false}
          customRequest={handleUpload}
        >
          <Button icon={<UploadOutlined />} loading={uploading}>Upload Web Story (ZIP)</Button>
        </Upload>
        {/* <Button icon={<PlusOutlined />} onClick={() => {
          form.resetFields();
          setEditing(null);
          setModalOpen(true);
        }}>Add New</Button> */}
      </div>

      <Table dataSource={stories} columns={columns} rowKey="_id" />

      <Modal
        title={editing ? 'Edit Web Story' : 'Add Web Story (name only)'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Story Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WebStoryCrud;
