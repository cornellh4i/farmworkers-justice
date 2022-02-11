import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DonutChartProps {
  innerRadius: number,
  outerRadius: number,
  data: any,
  height: number,
  width: number
}

function DonutChart(props: DonutChartProps) {
  const ref: React.MutableRefObject<null> = useRef(null);
  const createPie = d3
    .pie()
    .value(d => d.valueOf())
    .sort(null);
  const createArc: d3.Arc<any, any> = d3
    .arc()
    .innerRadius(props.innerRadius - 50)
    .outerRadius(props.outerRadius - 50);
  const colors = d3.scaleOrdinal(d3.schemeCategory10);
  const format = d3.format(".2f");

  // get list of data from the values
  var donutData = []
  for (let key in props.data) {
    let value = props.data[key]
    donutData.push(value)
  }
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


  const text = groupWithUpdate
    .append("text")
    .merge(groupWithData.select("text"));

  // Want to loop through the keys to make this generalizable
  const keys = Object.keys(props.data);
  function formatText(x: number) {
    // get the specific key each time
    return keys[x]
  }
  text
    .attr("text-anchor", function (d) {
      return (d.endAngle + d.startAngle) / 2 > Math.PI ?
        "end" : "start";
    })
    .attr("alignment-baseline", "middle")
    .attr("transform", function (d) {
      var c = createArc.centroid(d),
        x = c[0],
        y = c[1],
        h = Math.sqrt(x * x + y * y);
      return "translate(" + ((x + 10) / h * 175) + ',' +
        (y / h * 175) + ")";
    })
    .style("fill", "black")
    .style("font-size", 12)
    .text(d => formatText(d.index));

  return (
    <svg width={props.width} height={props.height}>
      <g style={{ display: "block", width: "100%", marginLeft: "auto", marginRight: "auto" }}
        ref={ref}
        transform={`translate(${props.outerRadius} ${props.outerRadius})`}
      />
    </svg>
  );
};

export default DonutChart;