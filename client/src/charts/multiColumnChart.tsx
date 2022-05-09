import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official'
import "@fontsource/rubik";


function MultiColumnChart() {
    const options = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'What languages do you speak?'
        },
        subtitle: {
          text: 'Source: Farmworkers\' Justice'
        },
        xAxis: {
          categories: [
            ''
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Percentage of Respondents'
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
          name: 'English',
          data: [20.9]
      
        }, {
            type: 'column',
          name: 'Spanish',
          data: [68.6]
      
        }, {
            type: 'column',
          name: 'Creole',
          data: [34.9]
      
        }, {
          type: 'column',
          name: 'Mixtec',
          data: [17.4]
      
        },
        {
          type: 'column',
          name: 'Kanjobal',
          data: [12.4]
      
        },
        {
          type: 'column',
          name: 'Zapotec',
          data: [10.4]
      
        },
        {
          type: 'column',
          name: 'Other',
          data: [29.4]
      
        }
        
      ]
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