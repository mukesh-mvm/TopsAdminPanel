import React, { useEffect, useState } from "react";
import { Table, Button, Spin, Popconfirm, message } from "antd";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { baseurl } from "../helper/Helper";

const CarFormTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch API data
  const fetchData = async () => {
    try {
      const res = await axios.get(baseurl+"/api/carforms/get");
      setData(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
      message.error("Failed to fetch data!");
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
      await axios.delete(`${baseurl}/api/carforms/${id}`);
      message.success("Deleted successfully!");
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete entry!");
    }
  };

  // Table columns
  const columns = [
    { title: "Brand", dataIndex: "brand", key: "brand" },
    { title: "Model", dataIndex: "model", key: "model" },
    { title: "Variant", dataIndex: "variant", key: "variant" },
    { title: "Transmission", dataIndex: "transmission", key: "transmission" },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: "KMs Driven", dataIndex: "kmsDriven", key: "kmsDriven" },
    { title: "Car Location", dataIndex: "carLocation", key: "carLocation" },
    { title: "Register State", dataIndex: "registerState", key: "registerState" },
    { title: "RTO Number", dataIndex: "rtoNumber", key: "rtoNumber" },
    { title: "Planning", dataIndex: "planning", key: "planning" },
    { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "CarFormsData");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "car_forms_data.xlsx");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🚗 Car Form Submissions</h2>
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

export default CarFormTable;
