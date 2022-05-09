import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";
import "@fontsource/rubik";

interface LineGraphProp {
  data: any;
  variableDescription: string;
  variableEncoding: string;
  index: number;
}

const toExclude: string[] = ["B11", "G01", "G03", "FWRDays", "NUMFEMPL"];

function findMinY(data: any) {
  return Math.min.apply(Math, data.map(function (o: any) { return o.value; }));
}

function findMaxY(data: any) {
  return Math.max.apply(Math, data.map(function (o: any) { return o.value; }));
}

function LineGraph(props: LineGraphProp) {
  const w = 400;
  const h = 400;

  useEffect(() => {
    const variableDescription = props.variableDescription;
    // const svg = d3.select(svgRef.current)
    var svg = d3.select(`#linegraph${props.index}`)
      .attr('width', w)
      .attr('height', h + 50)
      .style('background', 'white')
      .style('margin-top', '50')
      .style('margin-left', '30') // align with histogram y-axis
      .style('overflow', 'visible');

    var x = d3.scaleLinear().range([0, w])
    var xAxis = d3.axisBottom(x)
      .ticks(Object.keys(props.data).length)
      .tickFormat((d, i) => `${props.data[i].year} - ${props.data[i].year + 1}`)

    var y = d3.scaleLinear().range([h, 0])
    var yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat((d, i) => {
        if (toExclude.includes(props.variableEncoding)) {
          return `${d}`;
        } else {
          return `${d}%`
        }
      });

    svg.append('g')
      .attr("class", 'xAxis')
      .attr('transform', `translate(0, ${h})`);
    svg.append('g')
      .attr("class", 'yAxis')

    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", w / 2)
      .attr("y", h + 50)
      .style('font-family', 'Rubik')
      .text("Years");
    svg.append("text")
      .attr("y", -10)
      .style('font-family', 'Rubik')
      .text(() => {
        if (toExclude.includes(props.variableEncoding)) {
          return "";
        }
        return `Percentage of farmworkers over time for suvery question: ${variableDescription}`;
      });

    function update(data: any, xAxis: any, yAxis: any, x: any, y: any) {
      x.domain((data.length !== 0) ?
        [data[0].year, data[Object.keys(data).length - 1].year + 1]
        :
        [2007, 2018]) //[2007, 2018] is a temp placeholder before props is updated

      svg.selectAll(".xAxis").transition()
        .duration(1000)
        .call(xAxis);

      y.domain([.9 * findMinY(data), 1.1 * findMaxY(data)])

      svg.selectAll(".yAxis").transition()
        .duration(1000)
        .call(yAxis);

      var u: any = svg
        .selectAll('.line')
        .data([data])

      u
        .enter()
        .append('path')
        .attr('class', 'line')
        .merge(u)
        .transition()
        .attr('d', d3.line()
          .x((d, i) => { return x(data[i].year + 1) })  //TODO: THIS IS A TEMPORARY FIX: NOT TOO SURE WHY NEED THE +1 TO ALIGN LINE
          .y((d, i) => { return y(data[i].value) })
          .curve(d3.curveLinear))
        .attr('fill', 'none')
        .attr('stroke', '#FF820C')
        .attr('stroke-width', '4')

      u.exit().remove();
    }
    update(props.data, xAxis, yAxis, x, y)
  }, [props.data])

  return (
    <div>
      <svg id={`linegraph${props.index}`}></svg>
    </div>
  )
}

export default LineGraph
