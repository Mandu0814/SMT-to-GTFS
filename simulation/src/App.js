import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import Splash from "./components/Splash";
import Trip from "./components/Trip";
import "./css/app.css";

const fetchData = (FilE_NAME) => {
  const res = axios.get(
    `https://raw.githubusercontent.com/1023sherry/SMT-to-GTFS/main/simulation/src/data/${FilE_NAME}.json`
  );
  const data = res.then((r) => r.data);
  return data;
};

console.log("NODE_ENV:", process.env.NODE_ENV);


// const fetchData = (fileName) => {
//   const baseURL = process.env.NODE_ENV === "production"
//     ? `https://raw.githubusercontent.com/1023sherry/UAM_NEW/main/uam/src/data/`
//     : `${process.env.PUBLIC_URL}/data/`;
  
//   return axios.get(`${baseURL}${fileName}.json`).then((r) => r.data);
// };


const App = () => {
  // const [icon, setIcon] = useState([]);

  const [trip, setTrip] = useState([]);
  const [stop, setStop] = useState([]);
  const [line, setLine] = useState([]);

  const [trip2, setTrip2] = useState([]);
  const [stop2, setStop2] = useState([]);
  const [line2, setLine2] = useState([]);

  const [isloaded, setIsLoaded] = useState(false);

  const getData = useCallback(async () => {
    // const ICON = await fetchData("icon_data");
    const TRIP = await fetchData("bus_7611");
    const STOP = await fetchData("icon");
    const LINE = await fetchData("line");

    const TRIP2 = await fetchData("bus_7611_org");
    const STOP2 = await fetchData("icon_org");
    const LINE2 = await fetchData("line_org");  
   

    // setIcon((prev) => ICON);
    setTrip((prev) => TRIP);
    setStop((prev) => STOP);
    setLine((prev) => LINE);

    setTrip2((prev) => TRIP2);
    setStop2((prev) => STOP2);
    setLine2((prev) => LINE2);  


    setIsLoaded(true);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="container">
      {!isloaded && <Splash />}
      {isloaded && (
        <>
        <Trip name={"버스"} trip={trip} stop={stop} line={line}></Trip>
        <Trip name={"버스 원본"} trip={trip2} stop={stop2} line={line2}></Trip>
      </>
      )}
    </div>
  );
};

export default App;