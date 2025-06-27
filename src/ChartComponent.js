import React, { useEffect, useRef } from "react";
import Chart from 'chart.js/auto/chart.js';

const ChartComponent = ({ totalBatches, certified }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Total Batches', 'Certified'],
          datasets: [{
            label: 'Batch Statistics',
            data: [totalBatches, certified],
            backgroundColor: ['#3498db', '#27ae60'],
            borderColor: ['#2980b9', '#219653'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true, // Enable responsiveness
          maintainAspectRatio: false, // Allow custom sizing
          scales: {
            y: {
              beginAtZero: true,
              ticks: { font: { size: 12 } }
            },
            x: {
              ticks: { font: { size: 12 } }
            }
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: { font: { size: 14 } }
            }
          }
        }
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [totalBatches, certified]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} id="dashboardChart" style={{ maxHeight: '400px' }}></canvas>
    </div>
  );
};

export default ChartComponent;