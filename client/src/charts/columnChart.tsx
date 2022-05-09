import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import "@fontsource/rubik";
import { useEffect, useState } from 'react';

interface seriesProps {
  type: string,
  name: string,
  data: number[]
}

interface ColumnChartProps {
  data: seriesProps[]
}

function ColumnChart(props: ColumnChartProps) {
  // const [roundedData, setRoundedData] = useState(props.data)
  // // TEMPORARY SOLUTION BEFORE CACHE GETS UPDATED WITH ONLY 2dp
  // useEffect(() => {
  //   var newRoundedData = [...roundedData]
  //   newRoundedData.forEach(element => {
  //     element.data = [Number(element.data[0].toFixed(2))]
  //   });
  //   setRoundedData(newRoundedData)
    
  // }, [props.data])

  const options = {
    chart: {
      type: 'column'
    },
    xAxis: {
      categories: [''],
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Percentage of Respondents'
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      }
    },
    title:{
      text:''
    },
    series: props.data,
    legend: {
      labelFormatter: function (this: any) {
        return (this.name + " (" + this.yData[0].toFixed(2) + "%)");
      }
    },

  }

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

export default ColumnChart;