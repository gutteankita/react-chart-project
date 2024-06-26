// src/components/ChartComponent.tsx
import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import CustomModal from "./CustomModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ChartComponents.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

interface ChartState {
  data: {
    datasets: {
      label: string;
      data: { x: Date; y: number }[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  timeUnit: "day" | "week" | "month" | "year";
  error: string | null;
  showModal: boolean;
  modalData: { x: Date; y: number } | null;
}

class ChartComponent extends Component<{}, ChartState> {
  state: ChartState = {
    data: {
      datasets: [
        {
          label: "Sample Data",
          data: [],
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
        },
      ],
    },
    timeUnit: "day",
    error: null,
    showModal: false,
    modalData: null,
  };

  componentDidMount() {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formattedData = data.map(
            (item: { timestamp: string; value: number }) => ({
              x: new Date(item.timestamp),
              y: item.value,
            })
          );
          this.setState({
            data: {
              datasets: [
                {
                  ...this.state.data.datasets[0],
                  data: formattedData,
                },
              ],
            },
          });
        } else {
          console.error("Data is not in expected format or empty");
          this.setState({ error: "Data is not in expected format or empty" });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({ error: "Error fetching data" });
      });
  }

  handleTimeframeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ timeUnit: event.target.value as "day" | "week" | "month" | "year"});
  };

  handleExport = () => {
    const canvas = document.getElementById("chart") as HTMLCanvasElement;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "chart.png";
    link.click();
  };

  handleClick = (event: any, elements: any) => {
    if (elements.length) {
      const { datasetIndex, index } = elements[0];
      const dataPoint = this.state.data.datasets[datasetIndex].data[index];
      this.setState({
        showModal: true,
        modalData: dataPoint,
      });
    }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, modalData: null });
  };

  render() {
    return (
      <div className="main-container">
        {this.state.error ? (
          <div>Error: {this.state.error}</div>
        ) : (
          <>
            <div className="dropdown-container">
              <label className="label">Timeframe </label>
              <select className="options" onChange={this.handleTimeframeChange}>
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
              <button className="expot-btn" onClick={this.handleExport}>
                Export as PNG
              </button>
            </div>
            <Line
              className="lines-container"
              id="chart"
              data={this.state.data}
              options={{
                scales: {
                  x: {
                    type: "time",
                    time: {
                      unit: this.state.timeUnit,
                    },
                    grid: {
                        color: 'rgba(255, 0, 0, 0.1)', // Customize x axis grid color
                        
                      },
                      ticks: {
                        color: 'black', // Customize x axis tick color
                        font: {
                            size: 18, // Tick font size
                          },
                      },
                  },
                  y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 255, 0, 0.1)', // Customize y axis grid color
                      },
                      ticks: {
                        color: 'black', // Customize y axis tick color
                        font: {
                            size: 18, // Tick font size
                          },
                      },
                  },
                },
                plugins: {
                  title: {
                    display: true,
                    text: "Chart.js Time Scale",
                  },
                  zoom: {
                    pan: {
                      enabled: true,
                      mode: "x",
                    },
                    zoom: {
                      wheel: {
                        enabled: true,
                      },
                      mode: "x",
                    },
                  },
                },
                onClick: this.handleClick,
              }}
            />
            <CustomModal
              show={this.state.showModal}
              onClose={this.handleCloseModal}
              title="Data Point Details"
            >
              {this.state.modalData && (
                <>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {this.state.modalData.x.toString()}
                  </p>
                  <p>
                    <strong>Value:</strong> {this.state.modalData.y}
                  </p>
                </>
              )}
            </CustomModal>
          </>
        )}
      </div>
    );
  }
}

export default ChartComponent;
