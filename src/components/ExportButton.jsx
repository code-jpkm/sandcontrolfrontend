import { FaFileCsv, FaFileExcel } from "react-icons/fa";
import axios from "axios";

const ExportButton = ({ data, excelUrl="https://sandcontrollerbackend.onrender.com/api/sand-control/export" }) => {
  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headers = Object.keys(data[0]).join(",") + "\n";
    const csvRows = data.map((row) => Object.values(row).join(",")).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + csvRows;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sand_control_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = async () => {
    try {
      if (!excelUrl) {
        alert("Excel export URL is not available!");
        return;
      }

      const response = await axios.get(excelUrl, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sand_control_data.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel file:", error);
      alert("Failed to export Excel file.");
    }
  };

  return (
    <div className="mt-4 flex space-x-4">
      <button
        onClick={handleExportCSV}
        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
      >
        <FaFileCsv className="mr-2" /> Export CSV
      </button>
      
      <button
        onClick={handleExportExcel}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
      >
        <FaFileExcel className="mr-2" /> Export Excel
      </button>
    </div>
  );
};

export default ExportButton;
