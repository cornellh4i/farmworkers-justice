import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geojson from "geojson";

import { GeometryObject, Topology } from 'topojson-specification';

interface mapProp {
  height : number;
  width : number;
}

function Map (props : mapProp) {
    const svg = d3.select("#usmap");
    const width = props.width
    const height = props.height;
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
      .attr("class", "state")
      .attr("note", d => d.id!)  
      .attr("d", path)
      .on("mousedown", function clicked(s) {
        if(s != null && (s.target! as HTMLTextAreaElement).getAttribute('note') === "06") {
          div.text("california");
        }
    })});

    return (
    <svg id="usmap" height = {props.height} width = {props.width} ></svg>
    )
}

    export default Map;
