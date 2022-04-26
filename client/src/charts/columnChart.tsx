import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import "@fontsource/rubik";

interface seriesProps {
  type: string,
  name: string,
  data: number[]
}

interface ColumnChartProps {
  data: seriesProps[]
}

function ColumnChart(props: ColumnChartProps) {
  console.log("column chart data: ", props.data[0].data[0]);
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

function calcPercent(ind: number, data: number[]) {
  var total = data.reduce(function (a, b) { return a + b; });
  return data[ind] / total * 100;
}
export default ColumnChart;