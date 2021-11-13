import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function DonutChart(props: any) {
  const ref: React.MutableRefObject<null> = useRef(null);
  const createPie = d3
    .pie()
    .value(d => d.valueOf())
    .sort(null);
  const createArc: d3.Arc<any, any> = d3
    .arc()
    .innerRadius(props.innerRadius)
    .outerRadius(props.outerRadius);
  const colors = d3.scaleOrdinal(d3.schemeCategory10);
  const format = d3.format(".2f");

  useEffect(
    () => {
      const data = createPie(props.data);
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
        .attr("fill", (d, i) => colors("i"));

      const text = groupWithUpdate
        .append("text")
        .merge(groupWithData.select("text"));

      function formatText(x: any) {
        if (x === 0) {
          return "Doesn't Speak Any English";
        }
        if (x === 1) {
          return "Speaks A Little English";
        }
        if (x === 2) {
          return "Speaks English Somewhat";
        }
        if (x === 3) {
          return "Speaks English Well";
        }
        else {
          return "hello";
        }
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
          console.log(d)
          return "translate(" + (x / h * 200) + ',' +
            (y / h * 200) + ")";
        })
        .style("fill", "black")
        .style("font-size", 10)
        .text(d => formatText(d.index));
    },
    [props.data]
  );

  return (
    <svg width={"50%"} height={props.height}>
      <g style={{ display: "block", width: "100%", marginLeft: "auto", marginRight: "auto" }}
        ref={ref}
        transform={`translate(${props.outerRadius} ${props.outerRadius})`}
      />
    </svg>
  );
};

export default DonutChart;