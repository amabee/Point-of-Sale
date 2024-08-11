// components/GrowthChart.js
import React from 'react';
import ApexCharts from 'react-apexcharts';
import { config } from './configs';

const GrowthChart = () => {
    let cardColor, headingColor, legendColor, labelColor, shadeColor, borderColor;

    cardColor = config.colors.cardColor;
    headingColor = config.colors.headingColor;
    legendColor = config.colors.bodyColor;
    labelColor = config.colors.textMuted;
    borderColor = config.colors.borderColor;

  const growthChartOptions = {
    series: [78],
    labels: ['Growth'],
    chart: {
      height: 240,
      type: 'radialBar'
    },
    plotOptions: {
      radialBar: {
        size: 150,
        offsetY: 10,
        startAngle: -150,
        endAngle: 150,
        hollow: {
          size: '55%'
        },
        track: {
          background: '#f0f0f0',
          strokeWidth: '100%'
        },
        dataLabels: {
          name: {
            offsetY: 15,
            color: '#666', 
            fontSize: '15px',
            fontWeight: '500',
            fontFamily: 'Public Sans'
          },
          value: {
            offsetY: -25,
            color: '#333',
            fontSize: '22px',
            fontWeight: '500',
            fontFamily: 'Public Sans'
          }
        }
      }
    },
    colors:  [config.colors.primary],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.5,
        gradientToColors:[config.colors.primary], 
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.6,
        stops: [30, 70, 100]
      }
    },
    stroke: {
      dashArray: 5
    },
    grid: {
      padding: {
        top: -35,
        bottom: -10
      }
    },
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
    <div>
      <ApexCharts
        options={growthChartOptions}
        series={growthChartOptions.series}
        type="radialBar"
        height={240}
      />
    </div>
  );
};

export default GrowthChart;
