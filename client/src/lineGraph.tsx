import React, { useState, useRef, useEffect } from 'react';
import * as d3 from "d3";

export interface timeSeriesProp {
  year: number,
  value: number
}

interface lineGraphProp {
  data: Array<timeSeriesProp>;
  width: number;
  height: number
}

function LineGraph(props: any) {
  console.log("data received: ", props.data)
  const [data] = useState(props.data);
  const svgRef = useRef(null);
  useEffect(() => {
    const w = props.width;
    const h = props.height;
    const svg = d3.select(svgRef.current)
      .attr('width', w)
      .attr('height', h)
      .style('background', '#d3d3d3')
      .style('margin-top', '50')
      .style('overflow', 'visible');

    const xScale = d3.scaleLinear()
      .domain([data[0].year, data[Object.keys(data).length-1].year])
      .range([0, w])
    const yScale = d3.scaleLinear()
      .domain([0, h])
      .range([h, 0])

    const generatedScaleLine = d3.line()
      .x((d, i) => xScale(data[i].year))
      .y((d, i) => yScale(data[i].value))
      .curve(d3.curveCardinal)

    const xAxis = d3.axisBottom(xScale)
      .ticks(Object.keys(data).length)
      .tickFormat(i => String(i))
    const yAxis = d3.axisLeft(yScale)
      .ticks(5);
    svg.append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${h})`);
    svg.append('g')
      .call(yAxis)
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", w)
      .attr("y", h - 6)
      .text("years");
    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .text("average value");

    svg.selectAll('.line')
      .data([data])
      .join('path')
      .attr('d', d => generatedScaleLine(d))
      .attr('fill', 'none')
      .attr('stroke', 'black')
  }, [data]);
  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default LineGraph
