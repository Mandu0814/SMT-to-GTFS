/* global window */
import React, { useState, useEffect, useCallback } from "react";

import DeckGL from '@deck.gl/react';
import {Map} from 'react-map-gl';

import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {TripsLayer} from '@deck.gl/geo-layers';
import {
  IconLayer,
  LineLayer, 
  PolygonLayer, 
  ScatterplotLayer, 
  PathLayer
} from "@deck.gl/layers";

import Slider from "@mui/material/Slider";
// import legend from "../image/legend.png";
import "../css/trip.css";


const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
};

const material2 = {
  ambient: 0.3,
  diffuse: 0.6,
  shininess: 32,
  specularCol: [60, 64, 70]
};

const DEFAULT_THEME = {
  buildingColor: [228, 228, 228],
  buildingColor2: [255, 255, 255],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  material2,
  effects: [lightingEffect]
};

const INITIAL_VIEW_STATE = { 
  longitude: 126.924210, // 126.98 , -74
  latitude: 37.566297, // 37.57 , 40.72
  zoom: 12.5,
  pitch: 30,
  bearing: 33
};

const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

const minTime = 60 * 18 + 20;
const maxTime = 60 * 21 + 40;
const animationSpeed = 0.2;
const mapStyle = "mapbox://styles/spear5306/ckzcz5m8w002814o2coz02sjc";
const MAPBOX_TOKEN = `pk.eyJ1Ijoic2hlcnJ5MTAyNCIsImEiOiJjbG00dmtic3YwbGNoM2Zxb3V5NmhxZDZ6In0.ZBrAsHLwNihh7xqTify5hQ`;

const returnAnimationTime = (time) => {
    if (time > maxTime) {
      return minTime;
    } else {
      return time + 0.01 * animationSpeed;
    }
  };
  
  const addZeroFill = (value) => {
    const valueString = value.toString();
    return valueString.length < 2 ? "0" + valueString : valueString;
  };
  
  const returnAnimationDisplayTime = (time) => {
    const hour = addZeroFill(parseInt((Math.round(time) / 60) % 24));
    const minute = addZeroFill(Math.round(time) % 60);
    return [hour, minute];
  };
  
  const currData = (data, time) => {
    const arr = [];
    data.forEach((v) => {
      const timestamp = v.timestamp;
      const s_t = timestamp[0];
      const e_t = timestamp[timestamp.length - 1];
      if (s_t <= time && e_t >= time) {
        arr.push(v);
      }
    });
    return arr;
  };


const Trip = (props) => {
  const [time, setTime] = useState(minTime);
  const [animation] = useState({});

  const line = props.line;
  const trip = props.trip;
  const stop = props.stop;

  const line2 = props.line2;
  const trip2 = props.trip2;
  const stop2 = props.stop2;

  // const ps = currData(props.passenger, time);


  const animate = useCallback(() => {
    setTime((time) => returnAnimationTime(time));
    animation.id = window.requestAnimationFrame(animate);
  }, [animation]);

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation, animate]);

  // 버티포트
  const layers = [
    new PathLayer({  
      id: 'lines',
      data: line,
      getPath: d => d.lines,
      // getColor: d => d.color,
      getColor: d => [255,255,255],
      opacity: 0.7,
      widthMinPixels: 1,
      widthScale: 1,
      pickable: true,  
      rounded: true,
      shadowEnabled: false
    }),

    new PathLayer({  
      id: 'lines2',
      data: line2,
      getPath: d => d.lines,
      // getColor: d => d.color,
      getColor: d => [255,255,255],
      opacity: 0.7,
      widthMinPixels: 1,
      widthScale: 1,
      pickable: true,  
      rounded: true,
      shadowEnabled: false
    }),

    // new IconLayer({
    //   id: "stop",
    //   data: stop,
    //   sizeScale: 7,
    //   iconAtlas:
    //     "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    //   iconMapping: ICON_MAPPING,
    //   getIcon: d => "marker",
    //   getSize: 2,
    //   getPosition: d => d.coordinates,
    //   getColor: [255,255,255],
    //   opacity: 0.1,
    //   mipmaps: false,
    //   pickable: true,
    //   radiusMinPixels: 2,
    //   radiusMaxPixels: 2,
    // }),

    // new IconLayer({
    //   id: "stop2",
    //   data: stop2,
    //   sizeScale: 7,
    //   iconAtlas:
    //     "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
    //   iconMapping: ICON_MAPPING,
    //   getIcon: d => "marker",
    //   getSize: 2,
    //   getPosition: d => d.coordinates,
    //   getColor: [255,255,255],
    //   opacity: 0.1,
    //   mipmaps: false,
    //   pickable: true,
    //   radiusMinPixels: 2,
    //   radiusMaxPixels: 2,
    // }),

    new TripsLayer({  
      id: 'trips',
      data: trip,
      getPath: d => d.route,
      getTimestamps: d => d.timestamp,
      getColor: [255, 0, 0],
      opacity: 1,
      widthMinPixels: 4,
      rounded: true,
      capRounded : true,
      jointRounded : true,
      trailLength : 3,
      currentTime: time,
      shadowEnabled: false
    }),

    new TripsLayer({  
      id: 'trips2',
      data: trip2,
      getPath: d => d.route,
      getTimestamps: d => d.timestamp,
      getColor: [255, 0, 0],
      opacity: 1,
      widthMinPixels: 4,
      rounded: true,
      capRounded : true,
      jointRounded : true,
      trailLength : 3,
      currentTime: time,
      shadowEnabled: false
    }),



    // new ScatterplotLayer({
    //   id: 'scatterplot-layer',
    //   data: nodes,
    //   getPosition: d => d.coordinates,
    //   getFillColor: [255, 0, 0],
    //   getRadius: d => 100, // Adjust the radius as needed
    //   pickable: true,
    //   opacity: 0.8,
    // }),

  ];
  
  const SliderChange = (value) => {
    const time = value.target.value;
    setTime(time);
  };

  const [hour, minute] = returnAnimationDisplayTime(time);

  return (
    <div className="trip-container" style={{ position: "relative" }}>
      <DeckGL
        effects={DEFAULT_THEME.effects}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map mapStyle={mapStyle} mapboxAccessToken={MAPBOX_TOKEN} preventStyleDiffing={true}/>
      </DeckGL>
      <h1 className="time">TIME : {`${hour} : ${minute}`}
        <br />
        {props.name}
      </h1>
      <Slider
        id="slider"
        value={time}
        min={minTime}
        max={maxTime}
        onChange={SliderChange}
        track="inverted"
      />
      {/* <img className="legend" src={legend} alt="legend" ></img> */}
    </div>
  );
};

export default Trip;
