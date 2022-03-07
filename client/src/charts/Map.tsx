import * as d3 from "d3";
import * as topojson from "topojson-client";
import * as geojson from "geojson";
import { useEffect, useState, useRef } from 'react';
import { GeometryObject, Topology } from 'topojson-specification';
import './Map.scss'

interface mapProp {
  regionEncoding : string;
}

interface regionToStatesProps {
  regionEncoding: string,
  stateIDs: Array<string>
}

function Map(props : mapProp) {
  const svg = d3.select("#usmap");
  const width = 990; // modify this later
  const height = 770; // modify this later
  const margin = { top: 20, right: 20, bottom: 20, left:20};
  const mapWidth = width - margin.left - margin.right;
  const mapHeight = height - margin.top - margin.bottom;
  const map = svg.append("g")
  .attr("transform","translate("+margin.left+","+margin.top+")");
  const [stateIDs, setStateIDs] = useState<Array<string>>([])
  const regionToStatesData = require('../local-json/mapRegionEncoding.json'); 

  useEffect(() => {
    // TODO: set regionEncoding using mapfilterselected
    var newStateIDs = regionToStatesData["regionToStates"].find((el: regionToStatesProps) =>
    el.regionEncoding === props.regionEncoding).stateIDs;
    setStateIDs(newStateIDs)
  }, [])
    
  const us = require("./us-smaller.json")
  var states = topojson.feature((us as unknown) as Topology, ((us as unknown) as Topology).objects.states as GeometryObject) as geojson.FeatureCollection;    
  var projection = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], states);
  var path = d3.geoPath().projection(projection);
  map.selectAll("path.state").data(states.features)
  .join("path")
  .attr("note", d => d.id!)  
  .attr("d", path)
  .attr("class", function(d) {
    for (let i = 0; i < stateIDs.length; i++) {
      if (d.id === stateIDs[i]) { return "highlighted"; }
    }
    return "state";
  })
  console.log(map)
  

  return (
    <svg id="usmap" height={height} width={width} ></svg>
  )
}

export default Map;
