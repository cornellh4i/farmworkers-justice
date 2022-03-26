import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import './donutChart.scss';

interface DonutChartProps {
  data: any,
}

function DonutChart(props: DonutChartProps) {
  const ref: React.MutableRefObject<null> = useRef(null);
  const innerRadius = 160
  const outerRadius = 200
  const height = 400
  const width = 1000
  const labelHeight = 15
  const legendRectSize = 15  
  const textheight = 18                            
  const legendSpacing = 4;                                    // NEW
  
  useEffect(() => {
    //ceating the pie layout
    const createPie = d3
      .pie()
      .value(d => d.valueOf())
      .sort(null);
    
      //determining size of arcs
    const createArc: d3.Arc<any, any> = d3
      .arc()
      .innerRadius(innerRadius - 50)
      .outerRadius(outerRadius - 50);
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    const format = d3.format(".2f");

    // get list of data from the values
    var donutData = []
    for (let key in props.data) {
      let value = props.data[key]
      donutData.push(value)
    }

    const arrSum = donutData.reduce((a,b) => a + b, 0)
    
    const data = createPie(donutData);
    const group = d3.select(ref.current);
    const groupWithData = group.selectAll("g.arc").data(data);

    groupWithData.exit().remove();

    const groupWithUpdate = groupWithData
      .enter()
      .append("g")
      .attr("class", "arc");

    const path = groupWithUpdate
      .append("path")
      .merge(groupWithData.select("path.arc"));

    path
      .attr("class", "arc")
      .attr("d", createArc)
      .attr("fill", (d, i) => colors(i.toString()));

    // const text = groupWithUpdate
    //   .append("text")
    //   .merge(groupWithData.select("text"));

    // Want to loop through the keys to make this generalizable
    const keys = Object.keys(props.data);
    function formatText(x: number) {
      // get the specific key each time
      return keys[x]
    }

    
    //text labels 
    // text
    //   .attr("text-anchor", function (d) {
    //     return d.startAngle + (d.endAngle - d.startAngle)/2 < Math.PI ?
    //       "start":"end";
    //   })
    //   .attr("alignment-baseline", "middle")
    //   .attr("transform", function (d) {
    //     var c = createArc.centroid(d),
    //       x = c[0],
    //       y = c[1],
    //       // unsure of this
    //       h = Math.sqrt(x * x + y * y);
    //     return "translate(" + ((x + 10) / h * 175) + ',' +
    //       (y / h * 175) + ")";
    //   })
    //   .style("fill", "black")
    //   .style("font-size", 12)
    //   .text(d => formatText(d.index));

    
  // again rebind for legend

    const legend = groupWithUpdate
      .attr("class", "legend")
      .merge(groupWithData.select("rect.legend"))
      // .attr('transform', function(d, i) {                     // NEW
      //   var height = legendRectSize + legendSpacing;          // NEW
      //   var offset =  height * colors.domain().length / 2;     // NEW
      //   var horz = -2 * legendRectSize;                       // NEW
      //   var vert = i * height - offset;                       // NEW
      //   return 'translate(' + horz + ',' + vert + ')';        // NEW
      // });     
      .attr('transform', 'translate(" + (width - 110) + "," + (i * 15 + 20) + ")'); 

    legend.append("rect") // make a matching color rect
    .attr('width', legendRectSize)                          // NEW
    .attr('height', legendRectSize)                         // NEW
    // .attr("width",labelHeight)
    // .attr("height", labelHeight)
    .attr('x', innerRadius + innerRadius/10)
    .attr('y', d => (d.index-1) * labelHeight)
    .attr("fill", function(d, i) {
      return colors(i.toString());
    })
    .attr('stroke', 'grey')
    .style('stroke-width', '1px');

    legend.append("text") // add the text
    // .text(d => formatText(d.index))
    .text(d => formatText(d.index) + " - " + String(((d.data.valueOf()/arrSum)*100).toFixed(1)) + "%")
    .style("font-size", 12)
    .attr('x', d => outerRadius)
    .attr('y', d => (d.index) * labelHeight)
    // .attr('x', legendRectSize + legendSpacing)              // NEW
    // .attr('y', legendRectSize - legendSpacing)              // NEW
    .style('font-family', 'sans-serif')
    .style('font-size', `${textheight}px`);
  }, [props.data])
    
  return (
    <svg width={width} height={height}>
      <g style={{ display: "block", width: "100%", marginLeft: "auto", marginRight: "auto" }}
        ref={ref}
        transform={`translate(${outerRadius} ${outerRadius})`}
      />
    </svg>
  );
};

export default DonutChart;