import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import 'tailwindcss/tailwind.css';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const Dashboard = () => {
  const [alertsOverTime, setAlertsOverTime] = useState({});
  const [sourceIps, setSourceIps] = useState({});
  const [alertCategories, setAlertCategories] = useState({});

  useEffect(() => {
    import('./eve.json').then((data) => {
      const parseData = () => {
        const alertsOverTime = {};
        const sourceIps = {};
        const alertCategories = {};

        data.default.forEach(alert => {
          const date = new Date(alert.timestamp).toLocaleDateString();
          alertsOverTime[date] = (alertsOverTime[date] || 0) + 1;

          sourceIps[alert.src_ip] = (sourceIps[alert.src_ip] || 0) + 1;

          if (alert.alert && alert.alert.category) {
            const category = alert.alert.category;
            alertCategories[category] = (alertCategories[category] || 0) + 1;
          }
        });

        setAlertsOverTime(alertsOverTime);
        setSourceIps(sourceIps);
        setAlertCategories(alertCategories);
      };

      parseData();
    });
  }, []);

  const alertsOverTimeData = {
    labels: Object.keys(alertsOverTime),
    datasets: [{
      label: 'Number of Alerts',
      data: Object.values(alertsOverTime),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
    }]
  };

  const topSourceIps = Object.entries(sourceIps).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sourceIpsData = {
    labels: topSourceIps.map(ip => ip[0]),
    datasets: [{
      label: 'Source IPs',
      data: topSourceIps.map(ip => ip[1]),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    }]
  };

  const alertCategoriesData = {
    labels: Object.keys(alertCategories),
    datasets: [{
      data: Object.values(alertCategories),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)'
      ],
    }]
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center mb-20 mb-4">Security Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="mb-8">
          <h2 className="text-2xl mb-2">Alerts Over Time</h2>
          <Line data={alertsOverTimeData} options={{ responsive: true }} />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl mb-2">Top Source IPs</h2>
          <Bar data={sourceIpsData} options={{ responsive: true }} />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl mb-2">Alert Categories</h2>
          <Pie data={alertCategoriesData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Dashboard />
    </div>
  );
}

export default App;
