import { useState } from "react";

const SandControlTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("All");
  const rowsPerPage = 10;
  
  // Filter data based on date range and machine selection
  const filteredData = data.filter((record) => {
    const recordDate = new Date(record.date);
    const isWithinDateRange =
      (!startDate || recordDate >= new Date(startDate)) &&
      (!endDate || recordDate <= new Date(endDate));
    const isMachineMatch =
      selectedMachine === "All" || record.mixer === selectedMachine;
    return isWithinDateRange && isMachineMatch;
  });
  
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Function to format date as dd/mm/yy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  // Get the current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Extract unique machine names for dropdown
  const machineNames = ["All", ...new Set(data.map((record) => record.mixer))];

  // Generate report summary
  const report = {
    totalEntries: filteredData.length,
    avgMoisture:
      filteredData.reduce((sum, item) => sum + item.moisture, 0) /
        filteredData.length || 0,
    avgCompactibility:
      filteredData.reduce((sum, item) => sum + item.compactibility, 0) /
        filteredData.length || 0,
    totalNewSandAdded: filteredData.reduce(
      (sum, item) => sum + item.newSandAdded,
      0
    ),
  };

  return (
    <div className="overflow-x-auto p-4">
      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <select
          value={selectedMachine}
          onChange={(e) => setSelectedMachine(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          {machineNames.map((machine) => (
            <option key={machine} value={machine}>
              {machine}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full border border-gray-300 shadow-lg rounded-lg text-xs">
        {/* Table Header */}
        <thead className="bg-lightblue-500 text-white">
          <tr className="bg-blue-100 text-gray-700">
            {["S.No", "Date", "Shift", "Mixer", "Time", "Section", "Permeability", "Moisture", "Compactibility", "Mould Hardness", "Coal Dust", "Bentonite", "Water", "Weight", "Total Sand Prepared", "New Sand Added"].map(
              (header) => (
                <th key={header} className="py-2 px-3 border text-sm">{header}</th>
              )
            )}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {currentData.map((record, index) => (
            <tr
              key={record._id}
              className={`text-center border-b transition ${
                index % 2 === 0 ? "bg-white" : "bg-gray-100"
              } hover:bg-blue-50`}
            >
              <td className="py-1 px-3 border">{indexOfFirstRow + index + 1}</td>
              <td className="py-1 px-3 border">{formatDate(record.date)}</td>
              <td className="py-1 px-3 border">{record.shift}</td>
              <td className="py-1 px-3 border">{record.mixer}</td>
              <td className="py-1 px-3 border">{record.time}</td>
              <td className="py-1 px-3 border">{record.section}</td>
              <td className="py-1 px-3 border">{record.permeability}</td>
              <td className="py-1 px-3 border">{record.moisture}</td>
              <td className="py-1 px-3 border">{record.compactibility}</td>
              <td className="py-1 px-3 border">{record.mouldHardness.join(", ")}</td>
              <td className="py-1 px-3 border">{record.addition.coalDust}</td>
              <td className="py-1 px-3 border">{record.addition.bentonite}</td>
              <td className="py-1 px-3 border">{record.addition.water}</td>
              <td className="py-1 px-3 border">{record.weight}</td>
              <td className="py-1 px-3 border">{record.totalSandPrepared}</td>
              <td className="py-1 px-3 border">{record.newSandAdded}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Report Card */}
      <div className="mt-6 p-4 bg-gray-100 border rounded shadow">
        <h3 className="text-lg font-bold">Sand Control Report</h3>
        <p>Total Entries: {report.totalEntries}</p>
        <p>Average Moisture: {report.avgMoisture.toFixed(2)}%</p>
        <p>Average Compactibility: {report.avgCompactibility.toFixed(2)}%</p>
        <p>Total New Sand Added: {report.totalNewSandAdded} kg</p>
      </div>
    </div>
  );
};

export default SandControlTable;