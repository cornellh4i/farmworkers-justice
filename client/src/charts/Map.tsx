import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geojson from "geojson";

import { GeometryObject, Topology } from 'topojson-specification';
import './Map.scss'

interface mapProp {
  height : number;
  width : number;
  regionEncoding : number;
}

// For testing
let Encoding = {
  1 : ["02", "04", "06", "36"],
  2 : ["17", "43", "23"]
}

function Map (props : mapProp) {
  const svg = d3.select("#usmap");
  const width = props.width
  const height = props.height;
  type regionEncoding = typeof props.regionEncoding;
  const margin = { top: 20, right: 20, bottom: 20, left:20};
  const mapWidth = width - margin.left - margin.right;
  const mapHeight = height - margin.top - margin.bottom;
  const map = svg.append("g")
  .attr("transform","translate("+margin.left+","+margin.top+")");

  d3.json("./us-smaller.json").then(function (us){
    var states = topojson.feature((us as  unknown) as Topology, ((us as  unknown) as Topology).objects.states as GeometryObject) as geojson.FeatureCollection;    
    var projection = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], states);
    var path = d3.geoPath().projection(projection);
  
    var div = d3.select('body').append('div')   
    .style('opacity', 50)
    map.selectAll("path.state").data(states.features)
    .join("path")
    .attr("note", d => d.id!)  
    .attr("d", path)
    .attr("class", function(d) {
      for (let i = 0; i < Encoding[1].length; i++) {
        if (d.id === Encoding[1][i]) { return "highlighted"; }
      }
      return "state";
    })
  });

  return (
  <svg id="usmap" height = {props.height} width = {props.width} ></svg>
  )
}

    export default Map;
