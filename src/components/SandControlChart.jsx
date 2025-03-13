import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { TextField, Card, CardContent, Snackbar, Alert } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const targetRanges = {
  coalDust: [1.2, 1.2],
  bentonite: [2.7, 2.7],
  water: [9, 9],
  dry: [5, 5],
  total: [65, 65],
  permeability: [170, 230],
  compactibility: [38, 43],
  moisture: [4.0, 5.0],
  weight: [400, 600],
  coalDustAdded: [3.0, 4.0],
  totalSandPrepared: [800, 1200],
  newSandAdded: [200, 300],
};

const SandControlChart = ({ data }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    filterData();
  }, [startDate, endDate, data]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-GB"); // Format: dd/mm/yy
  };

  const filterData = () => {
    if (!startDate || !endDate) {
      setFilteredData(data);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const newData = data.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });

    setFilteredData(newData);
    checkForExceedingValues(newData);
  };

  const checkForExceedingValues = (dataToCheck) => {
    let newAlerts = [];
    dataToCheck.forEach((d) => {
      Object.keys(targetRanges).forEach((key) => {
        const value = getValue(d, key);
        const [min, max] = targetRanges[key];

        if (value < min) {
          newAlerts.push(`${key.toUpperCase()} is too LOW: ${value}`);
        } else if (value > max) {
          newAlerts.push(`${key.toUpperCase()} is too HIGH: ${value}`);
        }
      });
    });

    if (newAlerts.length) {
      setAlerts(newAlerts);
      setOpenAlert(true);
    } else {
      setOpenAlert(false);
    }
  };

  const getValue = (d, key) => {
    return (
      {
        coalDust: d.addition?.coalDust || 0,
        bentonite: d.addition?.bentonite || 0,
        water: d.addition?.water || 0,
        dry: d.compactionTime?.dry || 0,
        total: d.total || 0,
        permeability: d.permeability || 0,
        compactibility: d.compactibility || 0,
        moisture: d.moisture || 0,
        weight: d.weight || 0,
        coalDustAdded: d.coalDustAdded || 0,
        totalSandPrepared: d.totalSandPrepared || 0,
        newSandAdded: d.newSandAdded || 0,
      }[key] || 0
    );
  };

  const labels = filteredData.map((d) => formatDate(d.date));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Moisture",
        data: filteredData.map((d) => getValue(d, "moisture")),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Permeability",
        data: filteredData.map((d) => getValue(d, "permeability")),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Compactibility",
        data: filteredData.map((d) => getValue(d, "compactibility")),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Weight",
        data: filteredData.map((d) => getValue(d, "weight")),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const lineChartData = {
    labels,
    datasets: [
      {
        label: "Moisture",
        data: filteredData.map((d) => getValue(d, "moisture")),
        borderColor: "rgba(75, 192, 192, 0.6)",
        fill: false,
      },
      {
        label: "Permeability",
        data: filteredData.map((d) => getValue(d, "permeability")),
        borderColor: "rgba(255, 99, 132, 0.6)",
        fill: false,
      },
      {
        label: "Compactibility",
        data: filteredData.map((d) => getValue(d, "compactibility")),
        borderColor: "rgba(54, 162, 235, 0.6)",
        fill: false,
      },
      {
        label: "Weight",
        data: filteredData.map((d) => getValue(d, "weight")),
        borderColor: "rgba(255, 206, 86, 0.6)",
        fill: false,
      },
    ],
  };

  return (
    <Card>
      <CardContent>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: "10px" }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <div style={{ height: "400px", marginTop: "20px" }}>
          <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div style={{ height: "400px", marginTop: "20px" }}>
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={() => setOpenAlert(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={() => setOpenAlert(false)} severity="warning" sx={{ width: "100%" }}>
            {alerts.map((alert, index) => (
              <div key={index}>{alert}</div>
            ))}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default SandControlChart;
