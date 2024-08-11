import React from 'react';
import ApexCharts from 'react-apexcharts';
import { config } from "./configs"; 

const TotalRevenueChart = () => {
  const currentYear = new Date().getFullYear();
  let cardColor, headingColor, legendColor, labelColor, shadeColor, borderColor;

  cardColor = config.colors.cardColor;
  headingColor = config.colors.headingColor;
  legendColor = config.colors.bodyColor;
  labelColor = config.colors.textMuted;
  borderColor = config.colors.borderColor;

  const totalRevenueChartOptions = {
    series: [
      {
        name: new Date().getFullYear() - 1,

        data: [18, 7, 15, 29, 18, 12, 9]
      },
      {
        name: new Date().getFullYear() - 2,
        data: [-13, -18, -9, -14, -5, -17, -15]
      }
    ],
    chart: {
      height: 317,
      stacked: true,
      type: 'bar',
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        borderRadius: 10,
        startingShape: 'rounded',
        endingShape: 'rounded'
      }
    },
    colors: [config.colors.primary, config.colors.info],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 7,
      lineCap: 'round',
      colors: [cardColor]
    },
    legend: {
      show: true,
      horizontalAlign: 'left',
      position: 'top',
      markers: {
        height: 8,
        width: 8,
        radius: 12,
        offsetX: -5
      },
      fontSize: '13px',
      fontFamily: 'Public Sans',
      fontWeight: 400,
      labels: {
        colors: legendColor,
        useSeriesColors: false
      },
      itemMargin: {
        horizontal: 10
      }
    },
    grid: {
      strokeDashArray: 7,
      borderColor: borderColor,
      padding: {
        top: 0,
        bottom: -8,
        left: 20,
        right: 20
      }
    },
    fill: {
      opacity: [1, 1]
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: {
        style: {
          fontSize: '13px',
          fontFamily: 'Public Sans',
          colors: labelColor
        }
      },
      axisTicks: {
        show: false
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '13px',
          fontFamily: 'Public Sans',
          colors: labelColor
        }
      }
    },
    responsive: [
      {
        breakpoint: 1700,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '35%'
            }
          }
        }
      },
      {
        breakpoint: 1440,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 12,
              columnWidth: '43%'
            }
          }
        }
      },
      {
        breakpoint: 1300,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 11,
              columnWidth: '45%'
            }
          }
        }
      },
      {
        breakpoint: 1200,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 11,
              columnWidth: '37%'
            }
          }
        }
      },
      {
        breakpoint: 1040,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 12,
              columnWidth: '45%'
            }
          }
        }
      },
      {
        breakpoint: 991,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 12,
              columnWidth: '33%'
            }
          }
        }
      },
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 11,
              columnWidth: '28%'
            }
          }
        }
      },
      {
        breakpoint: 640,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 11,
              columnWidth: '30%'
            }
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '38%'
            }
          }
        }
      },
      {
        breakpoint: 440,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 10,
              columnWidth: '50%'
            }
          }
        }
      },
      {
        breakpoint: 380,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 9,
              columnWidth: '60%'
            }
          }
        }
      }
    ],
    states: {
      hover: {
        filter: {
          type: 'none'
        }
      },
      active: {
        filter: {
          type: 'none'
        }
      }
    }
  };

  return (
    <div id="totalRevenueChart">
      <ApexCharts
        options={totalRevenueChartOptions}
        series={totalRevenueChartOptions.series}
        type="bar"
        height={317}
      />
    </div>
  );
};

export default TotalRevenueChart;
