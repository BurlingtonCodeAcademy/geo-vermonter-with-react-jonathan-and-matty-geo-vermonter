import React from "react";
import ReactDOM from "react-dom";
import Leaflet from "leaflet";
import "./styles.css";
import countyBorders from "./countyBorders.js";

class Livemap extends React.Component {
  constructor(props) {
    super(props)
    this.mapRef = React.createRef();
    this.map = null;
    let map = this.map;
  }
  componentDidMount() {
    this.map = Leaflet.map(this.mapRef.current, { zoomControl: false }).setView([43.8759, -72.2121], 8);
    Leaflet.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
      minZoom: 1,
      center: [43.8759, -72.2121],
    }).addTo(this.map);
    Leaflet.geoJSON(countyBorders, { color: 'rgb(255, 255, 255, 0.5)', fillOpacity: '.175', weight: 2 }).addTo(this.map);
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    this.map.dragging.disable();
    this.map.touchZoom.disable();

    this.map.on('click', this.onMapClick);
  }

  componentWillUnmount() {
    this.map.off("click", this.onMapClick);
    this.map = null;
  }

  onMapClick = (e) => {
    const { lat, lng } = e.latlng;
  //  Leaflet.marker([lat, lng]).addTo(this.map)
  };

  render() {
    return <div ref={this.mapRef} id="mapid" className="map" />;
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<Livemap />, rootElement);


const counties =
  [
    {
      name: "Addison County",
      center: [44.001944, -73.145556],
      town: "Middlebury"
    }, {
      name: "Bennington County",
      center: [43.1410, -73.0810],
      town: "Manchester Center"
    }, {
      name: "Caledonia County",
      center: [44.46, -72.1159899],
      town: "Danville"
    }, {
      name: "Chittenden County",
      center: [44.501944, -73.093889],
      town: "Essex Junction"
    }, {
      name: "Essex County",
      center: [44.73, -71.7801148],
      town: "Ferdinand"
    }, {
      name: "Franklin County",
      center: [44.809722, -73.087222],
      town: "St. Albans City"
    }, {
      name: "Grand Isle County",
      center: [44.7882463, -73.2909557],
      town: "North Hero"
    }, {
      name: "Lamoille County",
      center: [44.599563, -72.6278814],
      town: "Hyde Park"
    }, {
      name: "Orange County",
      center: [43.9956247, -72.3912821],
      town: "Chelsea"
    }, {
      name: "Orleans County",
      center: [44.83, -72.25],
      town: "Irasburg"
    }, {
      name: "Rutland County",
      center: [43.606944, -72.974722],
      town: "Rutland"
    }, {
      name: "Washington County",
      center: [44.262222, -72.580833],
      town: "Montpelier"
    }, {
      name: "Windham County",
      center: [42.984806, -72.656049],
      town: "Newfane"
    }, {
      name: "Windsor County",
      center: [43.484167, -72.385556],
      town: "Windsor"
    }
  ];

