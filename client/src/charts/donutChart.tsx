import React, { useEffect, useRef, useState } from "react";
import Grid from '@mui/material/Grid'
import * as d3 from "d3";
import './donutChart.scss';

interface DonutChartProps {
  data: any,
  index: number
}

function DonutChart(props: DonutChartProps) {
  const innerRadius = 160
  const outerRadius = 200
  const height = 400
  const width = 400
  const [data, setData] = useState<number[]>([])
  const [descriptions, setDescription] = useState<string[]>([])
  var colors: d3.ScaleOrdinal<string, string, never> =  d3.scaleOrdinal(d3.schemeCategory10);

  // TODO: FIX GRAPH DOESNT SHOW UP WHEN DROPDOWN SWITCHES WHEN IT IS NOT COLLAPSED 
  useEffect(() => {
    colors = d3.scaleOrdinal(d3.schemeCategory10);

    // get list of data from the values
    var donutData: number[] = []
    var donutDescription: string[] = []
    for (let key in props.data) {
      let value = props.data[key]
      donutData.push(value)
      donutDescription.push(key)
    }
    setData(donutData)
    setDescription(donutDescription)
    const arrSum = donutData.reduce((a,b) => a + b, 0)
    
    function update() {    
      //creating the pie layout
      var createPie = d3
        .pie()
        .value(d => d.valueOf())
        .sort(null);

      //determining size of arcs
      const createArc: d3.Arc<any, any> = d3
        .arc()
        .innerRadius(innerRadius - 50)
        .outerRadius(outerRadius - 50);
      
      var path = d3.select(`#donutChart${props.index}`)
      .datum(donutData).selectAll("path")
      .data(createPie)
      // .append("path")
        .attr("class","piechart")
        .attr("fill", function(d,i){ return colors(i.toString()); })
        .attr("d", createArc);
      // .each(function(d){ this._current = d; })

      // enter data and draw pie chart
      path
      .enter()
      .append("path")
      .transition()
        .attr("class","piechart")
        .attr("fill", function(d,i){ return colors(i.toString()); })
        .attr("d", createArc);
      // .each(function(d){ this._current = d; })

      d3.select(`#donutChart${props.index}`)
        .datum(donutData).selectAll("path")
        .data(createPie).exit().remove();
    }

    update()
  }, [props.data])
    
  return (
    <Grid container>
      <Grid item xs>
        <svg height={height} width={width}>
          <g id={`donutChart${props.index}`} style={{transform: `translate(200px, 200px)`}}></g>
        </svg>
      </Grid>
      <Grid item xs alignItems='center' display='flex'>
        <div>
          {descriptions.map((element: string, index: number) => 
            <Grid container spacing={2} className="legend-row" key={index}>
              <Grid item xs={2}>
                <div className='rect' style={{backgroundColor: colors(index.toString())}}></div>
              </Grid>
              <Grid item xs={10} alignItems='center' display='flex'>
                {element} ({Math.round(data[index]* 100)}%)
              </Grid>
            </Grid>
          )}
        </div>
      </Grid>
    </Grid>
  );
};

export default DonutChart;