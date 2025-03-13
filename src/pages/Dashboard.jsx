import { useState, useEffect } from "react";
import { getSandControlData } from "../api/sandControlApi";
import ExportButton from "../components/ExportButton";
import SandControlChart from "../components/SandControlChart";
import SandControlForm from "../components/SandControlForm";
import SandControlTable from "../components/SandControlTable";
import { toast } from "react-toastify";
import Button from '@mui/material/Button';

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const data = await getSandControlData();
      setRecords(data);
    } catch (error) {
      toast.error("Failed to load data!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-2xl rounded-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Sand Control Dashboard</h1>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          {showForm ? "Close" : "Add New"}
        </Button>
      </div>

      {/* Form - Only Visible When Button Clicked */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-md">
          <SandControlForm refreshData={fetchRecords} />
        </div>
      )}

      {/* Table and Chart Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 shadow-md rounded-lg">
          <SandControlTable data={records} />
        </div>
        <div className="bg-gray-50 p-4 shadow-md rounded-lg">
          <SandControlChart data={records} />
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-6 text-center">
        <ExportButton data={records} />
      </div>
    </div>
  );
};

export default Dashboard;
