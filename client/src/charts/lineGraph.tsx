import React, { useState, useRef, useEffect } from 'react';
import * as d3 from "d3";

export interface timeSeriesProp {
  year: number,
  value: number
}

interface lineGraphProp {
  data: any;
  width: number;
  height: number
}

function LineGraph(props: lineGraphProp) {
  const svgRef: React.MutableRefObject<null> = useRef(null);
  const w = props.width;
  const h = props.height;
  const svg = d3.select(svgRef.current)
    .attr('width', w)
    .attr('height', h)
    .style('background', '#d3d3d3')
    .style('margin-top', '50')
    .style('margin-left', '50')
    .style('overflow', 'visible');

  const xScale = d3.scaleLinear()
    .domain((props.data.length !== 0)? 
      [props.data[0].year, props.data[Object.keys(props.data).length-1].year] : 
      [2008, 2018]) //[2008, 2018] is a temp placeholder before props is updated
    .range([0, w])
  const yScale = d3.scaleLinear()
    .domain([0, 1])
    .range([h, 0])

  const generatedScaleLine = d3.line()
    .x((d, i) => xScale(props.data[i].year))
    .y((d, i) => yScale(props.data[i].value))
    .curve(d3.curveCardinal)

  const xAxis = d3.axisBottom(xScale)
    .ticks(Object.keys(props.data).length)
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
    .text("Percentage of Foreign Born"); //TODO: Will need to be generalized later on

  svg.selectAll('.line')
    .data([props.data])
    .join('path')
    .attr('d', d => generatedScaleLine(d))
    .attr('fill', 'none')
    .attr('stroke', 'black')
  return (
    <svg ref={svgRef}></svg>
  )
}

export default LineGraph
