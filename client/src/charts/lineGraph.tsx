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
  // const svgRef: React.MutableRefObject<null> = useRef(null);
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
      //.style('stroke-dasharray', ('3,3')) //makes everything into dashes 
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
    // const xScale = d3.scaleLinear()
    //   .domain((props.data.length !== 0)? 
    //     [props.data[0].year, props.data[Object.keys(props.data).length-1].year + 1] : 
    //     [2007, 2018]) //[2007, 2018] is a temp placeholder before props is updated
    //   .range([0, w])
    // const yScale = d3.scaleLinear()
    //   .domain([.9 * findMinY(props.data), 1.1 * findMaxY(props.data)])
    //   .range([h, 0])

    // const generatedScaleLine = d3.line()
    //   .x((d, i) => xScale(props.data[i].year + 1))  //TODO: THIS IS A TEMPORARY FIX: NOT TOO SURE WHY NEED THE +1 TO ALIGN LINE
    //   .y((d, i) => yScale(props.data[i].value))
    //   .curve(d3.curveCardinal)

    // const xAxis = d3.axisBottom(xScale)
    //   .ticks(Object.keys(props.data).length)
    //   .tickFormat((d , i) => `${props.data[i].year} - ${props.data[i].year + 1}`)
    // const yAxis = d3.axisLeft(yScale)
    //   .ticks(5)
    //   .tickFormat((d, i) => {
    //     if(toExclude.includes(props.variableEncoding)) {
    //       return `${d}`;
    //     } else {
    //       return `${d}%`
    //     }
    //   });

    svg.append('g')
      // .call(xAxis)
      .attr("class", 'xAxis')
      .attr('transform', `translate(0, ${h})`);
    svg.append('g')
      .attr("class", 'yAxis')
    // .call(yAxis)

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
      console.log("update called")
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
      console.log("data: ", data);

      var u: any = svg
        // .selectAll('.line')
        // .data([data])
        .selectAll('g.dot')
        .data(data)
        .enter().append('g')
        .attr('class', 'dot')
        .selectAll('circle')
        .data(function (d) { return d.year; })
        .enter().append('circle')
        .attr("r", 6)
        .attr("cx", function (d, i) { return x(d.year); })
        .attr("cy", function (d, i) { return y(d.Value); });
      //console.log(x(data.year));

      u
        .enter()
        .append('path')
        .attr('class', 'line')
        .merge(u)
        .transition()
        .attr('d', d3.line()
          .x((d, i) => { return x(data[i].year + 1) })  //TODO: THIS IS A TEMPORARY FIX: NOT TOO SURE WHY NEED THE +1 TO ALIGN LINE
          .y((d, i) => { return y(data[i].value) })
          .curve(d3.curveCardinal))
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
