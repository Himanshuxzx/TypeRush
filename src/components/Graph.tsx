import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Graph = ({ graphData }: { graphData: number[][] }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: 0,
        max: Math.max(...graphData.map((i) => i[0]), 1),
        ticks: {
          stepSize: 5,
          color: "rgba(255, 255, 255, 0.6)",
          font: {
            size: 10,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
        border: {
          color: "rgba(255, 255, 255, 0.3)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          font: {
            size: 10,
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        },
        border: {
          color: "rgba(255, 255, 255, 0.3)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ff6b6b",
        bodyColor: "#4ecdc4",
        borderColor: "#ff6b6b",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: () => "Time Elapsed",
          label: (context: any) => `${context.parsed.y} WPM`,
        },
      },
    },
    elements: {
      point: {
        radius: 3,
        backgroundColor: "#ff6b6b",
        borderColor: "#fff",
        borderWidth: 2,
        hoverRadius: 6,
      },
    },
  };

  return (
    <div className="w-full h-48 glass-effect rounded-xl p-4">
      <div className="text-center mb-2 text-sm font-semibold text-cyan-300">
        Speed Progress
      </div>
      <Line
        data={{
          labels: graphData.map((i) => `${i[0]}s`),
          datasets: [
            {
              data: graphData.map((i) => i[1]),
              borderColor: "#4ecdc4",
              backgroundColor: "rgba(78, 205, 196, 0.1)",
              tension: 0.4,
              borderWidth: 3,
              fill: true,
              pointBackgroundColor: "#ff6b6b",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#ff4757",
            },
          ],
        }}
        options={options}
      />
    </div>
  );
};

export default Graph;
