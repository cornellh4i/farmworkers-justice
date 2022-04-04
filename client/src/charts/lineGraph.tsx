import React, { useEffect, useRef } from 'react';
import * as d3 from "d3";
import "@fontsource/rubik";

interface LineGraphProp {
  data: any;
  variableDescription: string;
  variableEncoding: string;
}

const toExclude: string[] = ["B11", "G01", "G03", "FWRDays", "NUMFEMPL"];

function findMinY(data: any){
  return Math.min.apply(Math, data.map(function(o: any) { return o.value; }));
}

function findMaxY(data: any){
  return Math.max.apply(Math, data.map(function(o: any) { return o.value; }));
}

function LineGraph(props: LineGraphProp) {
  const svgRef: React.MutableRefObject<null> = useRef(null);
  const w = 400;
  const h = 400;

  useEffect(() => {
    const variableDescription = props.variableDescription;
    const svg = d3.select(svgRef.current)
      .attr('width', w)
      .attr('height', h + 50)
      .style('background', 'white')
      .style('margin-top', '50')
      .style('margin-left', '50')
      .style('overflow', 'visible');
    const xScale = d3.scaleLinear()
      .domain((props.data.length !== 0)? 
        [props.data[0].year, props.data[Object.keys(props.data).length-1].year + 1] : 
        [2007, 2018]) //[2007, 2018] is a temp placeholder before props is updated

      .range([0, w])
    const yScale = d3.scaleLinear()
      .domain([findMinY(props.data), findMaxY(props.data)])
      .range([h, 0])

    const generatedScaleLine = d3.line()
      .x((d, i) => xScale(props.data[i].year + 1))  //TODO: THIS IS A TEMPORARY FIX: NOT TOO SURE WHY NEED THE +1 TO ALIGN LINE
      .y((d, i) => yScale(props.data[i].value))
      .curve(d3.curveCardinal)
    
    const xAxis = d3.axisBottom(xScale)
      .ticks(Object.keys(props.data).length)
      .tickFormat((d , i) => `${props.data[i].year} - ${props.data[i].year + 1}`)
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat((d, i) => {
        if(toExclude.includes(props.variableEncoding)) {
          return `${d}`;
        } else {
          return `${d}%`
        }
      });
    svg.append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${h})`);
    svg.append('g')
      .call(yAxis)
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
        if(toExclude.includes(props.variableEncoding)) {
          return "";
        } 
        return `Percentage of farmworkers over time for suvery question: ${variableDescription}`;
      });

    svg.selectAll('.line')
      .data([props.data])
      .join('path')
      .attr('d', d => generatedScaleLine(d))
      .attr('fill', 'none')
      .attr('stroke', '#FF820C')
      .attr('stroke-width', '4')
  }, [props.data])
  
  return (
    <svg ref={svgRef}></svg>
  )
}

export default LineGraph
