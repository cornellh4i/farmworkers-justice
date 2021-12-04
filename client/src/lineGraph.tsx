import React, { useState, useRef, useEffect } from 'react';
import * as d3 from "d3";

function LineGraph(props: any) {
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

    svg.selectAll('.line')
      .data([data])
      .join('path')
      .attr('d', d => generatedScaleLine(d))
      .attr('fill', 'none')
      .attr('stroke', 'black')
  }, [data]);
  return (
    <div>
      <p>Data from server: {data[4].year}</p>
      <p>Data from server: {data[5].value}</p>
      <p>Data from server: {Object.keys(data).length}</p>
      <svg ref={svgRef}></svg>
    </div>
  )
}

export default LineGraph

