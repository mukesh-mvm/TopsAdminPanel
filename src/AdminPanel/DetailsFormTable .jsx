import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Popconfirm, message } from "antd";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DetailsFormTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API data
  const fetchData = async () => {
    try {
      const res = await axios.get("https://api.top5shots.com/api/detailsForm/getAll");
      setData(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete entry by ID
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://api.top5shots.com/api/detailsForm/delete/${id}`);
      message.success("Deleted successfully!");
      // Refresh table
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete!");
    }
  };

  // Table columns
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Project Interest", dataIndex: "projectInterest", key: "projectInterest" },
    { title: "Budget", dataIndex: "budgets", key: "budgets" },
    { title: "Buy Planning", dataIndex: "buyPlanning", key: "buyPlanning" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this entry?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DetailsFormData");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "details_form_data.xlsx");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📋 User Details</h2>
      <br />
      <Button type="primary" onClick={exportToExcel} style={{ marginBottom: 16 }}>
        Export
      </Button>
      {loading ? (
        <Spin tip="Loading data..." />
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={data}
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default DetailsFormTable;
