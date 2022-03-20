import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'


import * as d3 from "d3";
import "@fontsource/rubik";


function MultiColumnChart() {
    const options = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Monthly Average Rainfall'
        },
        subtitle: {
          text: 'Source: WorldClimate.com'
        },
        xAxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Rainfall (mm)'
          }
        },
        // tooltip: {
        //   headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        //   pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        //     '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        //   footerFormat: '</table>',
        //   shared: true,
        //   useHTML: true
        // },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
        type: 'column',
          name: 'Tokyo',
          data: [49.9]
      
        }, {
            type: 'column',
          name: 'New York',
          data: [83.6]
      
        }, {
            type: 'column',
          name: 'London',
          data: [48.9]
      
        }, {
          type: 'column',
          name: 'Berlin',
          data: [42.4]
      
        }]
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
      
  
  
export default MultiColumnChart;

// example input: 
      // [{
      //   variable: "new york", 
      //   data: [values ....]
      // }, 
      // {
        //   variable: "berlin", 
        //   data: [values ....]
        // }, 
        // ...
      // ]