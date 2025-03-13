import { useState } from "react";
import { addSandControlRecord } from "../api/sandControlApi";
import { toast, ToastContainer } from "react-toastify";

const SandControlForm = ({ refreshData }) => {
  const [formData, setFormData] = useState({
    date: "",
    shift: "",
    mixer: "",
    time: "",
    section: "",
    targetFract: [],
    addition: { coalDust: "", bentonite: "", water: "" },
    compactionTime: { dry: "", total: "" },
    permeability: "",
    compactibility: "",
    moisture: "",
    mouldHardness: [],
    weight: "",
    coalDustAdded: "",
    totalSandPrepared: "",
    newSandAdded: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value.split(",").map(Number) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "date", "shift", "mixer", "time", "section", "permeability", 
      "compactibility", "moisture", "weight", "coalDustAdded", 
      "totalSandPrepared", "newSandAdded"
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.warn(`Please fill the '${missingFields[0]}'`, { autoClose: 2000 });
      return;
    }

    try {
      await addSandControlRecord(formData);
      toast.success("Record added successfully!");
      refreshData();
    } catch {
      toast.error("Failed to add record.");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" reverseOrder={false} />
      <form 
        onSubmit={handleSubmit} 
        className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Form Fields */}
          {[
            { label: "Date", name: "date", type: "date" },
            { label: "Time", name: "time", type: "time" },
            { label: "Permeability", name: "permeability", type: "number" },
            { label: "Compactibility", name: "compactibility", type: "number" },
            { label: "Moisture", name: "moisture", type: "number" },
            { label: "Weight", name: "weight", type: "number" },
            { label: "Coal Dust Added", name: "coalDustAdded", type: "number" },
            { label: "Total Sand Prepared", name: "totalSandPrepared", type: "number" },
            { label: "New Sand Added", name: "newSandAdded", type: "number" },
          ].map(({ label, name, type }) => (
            <label key={name} className="block">
              {label} <span className="text-red-500">*</span>
              <input 
                type={type} 
                name={name} 
                value={formData[name]} 
                onChange={handleChange} 
                className="border p-2 w-full rounded" 
                required 
              />
            </label>
          ))}

          {/* Dropdown Fields */}
          {[
            { label: "Shift", name: "shift", options: ["Day", "Night"] },
            { label: "Mixer", name: "mixer", options: ["V.M.E", "WESMAN"] },
            { label: "Section", name: "section", options: ["450", "900", "HANDLINE"] },
          ].map(({ label, name, options }) => (
            <label key={name} className="block">
              {label} <span className="text-red-500">*</span>
              <select 
                name={name} 
                value={formData[name]} 
                onChange={handleChange} 
                className="border p-2 w-full rounded" 
                required
              >
                <option value="">Select {label}</option>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          ))}

          {/* Special Fields */}
          <label className="block">
            Target Fract (comma-separated)
            <input 
              type="text" 
              name="targetFract" 
              value={formData.targetFract.join(",")} 
              onChange={(e) => handleArrayChange(e, "targetFract")} 
              className="border p-2 w-full rounded" 
            />
          </label>

          {/* Nested Object Fields */}
          {[
            { label: "Coal Dust Addition", name: "addition.coalDust" },
            { label: "Bentonite Addition", name: "addition.bentonite" },
            { label: "Water Addition", name: "addition.water" },
            { label: "Dry Compaction Time", name: "compactionTime.dry" },
            { label: "Total Compaction Time", name: "compactionTime.total" },
          ].map(({ label, name }) => (
            <label key={name} className="block">
              {label} <span className="text-red-500">*</span>
              <input 
                type="number" 
                name={name} 
                value={formData[name.split(".")[0]][name.split(".")[1]]} 
                onChange={handleChange} 
                className="border p-2 w-full rounded" 
                required 
              />
            </label>
          ))}
        </div>

        <button 
          type="submit" 
          className="mt-6 w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 block sm:inline"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default SandControlForm;
