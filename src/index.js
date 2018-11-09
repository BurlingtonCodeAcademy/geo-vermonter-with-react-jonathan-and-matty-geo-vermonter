import React from 'react';
import ReactDOM from 'react-dom';
import Leaflet from 'leaflet';
import './styles.css';
import countyBorders from './countyBorders.js';
import counties from './counties.js';

class Livemap extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.map = null;
    this.lat = 43.7;
    this.long = -72.6;
    this.viewLat = this.lat;
    this.viewLong = this.long;

  }
  componentDidMount() {
    this.map = Leaflet.map(this.mapRef.current, {
      zoomControl: false
    }).setView([this.lat, this.long], 15);
    Leaflet.tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          '&copy; <a href="http://www.esri.com/">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
        minZoom: 1,
        center: [this.lat, this.long]
      }
    ).addTo(this.map);
    Leaflet.geoJSON(countyBorders, {
      color: 'rgb(255, 255, 255, 0.5)',
      fillOpacity: '.175',
      weight: 2
    }).addTo(this.map);
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    this.map.dragging.disable();
    this.map.touchZoom.disable();

    this.map.on('click', this.onMapClick);
  }

  componentWillUnmount() {
    this.map.off('click', this.onMapClick);
    this.map = null;
  }

  randomCountyIndex() {
    let index = (Math.floor(Math.random() * counties.length));
    return index;
  }

  moveAndDrawLine(latPlus, longPlus, color) {
    let pointA = new Leaflet.LatLng(this.viewLat, this.viewLong);
    this.viewLat = +this.viewLat + latPlus;
    this.viewLong = +this.viewLong + longPlus;
    let pointB = new Leaflet.LatLng(this.viewLat, this.viewLong);
    let pointList = [pointA, pointB];

    let myPolyline = new Leaflet.polyline(pointList, {
      color: color,
      weight: 4,
      opacity: 0.7,
      smoothFactor: 1
    });

    myPolyline.addTo(this.map);
    this.map.panTo(new Leaflet.LatLng(this.viewLat, this.viewLong));
  }

  goNorth() {
    this.moveAndDrawLine(0.0025, 0, 'yellow');
  }

  goWest() {
    this.moveAndDrawLine(0, -0.0025, 'cyan')
  }

  goEast() {
    this.moveAndDrawLine(0, 0.0025, 'orange')
  }

  goSouth() {
    this.moveAndDrawLine(-0.0025, 0, 'red');
  }

  goReturn() {
    this.moveAndDrawLine.bind(this);
    this.viewLat = this.lat;
    this.viewLong = this.long;
    this.map.flyTo(new Leaflet.LatLng(this.lat, this.long));
  }

  randomCounty() {
    let countyIndex = this.randomCountyIndex();
    this.lat = counties[countyIndex].center[0];
    this.long = counties[countyIndex].center[1];
    this.goReturn();
  }

  onMapClick = e => {
    //const { lat, lng } = e.latlng;
    //  Leaflet.marker([lat, lng]).addTo(this.map)
  };

  render() {
    return (
      <div className="row">
        <div ref={this.mapRef} id="mapid" className="map">
          <div id="wrapper">
            <div id="northButton">
              <button id="north" onClick={this.goNorth.bind(this)}>
                North
						</button>
            </div>
            <div id="map-middle">
              <div id="westButton">
                <button id="west" onClick={this.goWest.bind(this)}>
                  West
							</button>
              </div>
              <div id="map">
                <div id="returnButton">
                  <button id="return" onClick={this.goReturn.bind(this)}>
                    Return
								</button>
                </div>
              </div>
              <div id="eastButton">
                <button id="east" onClick={this.goEast.bind(this)}>
                  East
							</button>
              </div>
            </div>
            <div className="row">
              <div className="balancer" />
              <div id="southButton">
                <button id="south" onClick={this.goSouth.bind(this)}>
                  South
							</button>
              </div>
              <div id="county-image">
                <button id="countiesButton" onClick={this.randomCounty.bind(this)}>
                  Start
							</button>
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div id="status">
            <div className="bold">
              GeoVermonter
          </div>
          </div>
          <button>Addison County</button>
          <button>Bennington County</button>
          <button>Caledonia County</button>
          <button>Chittenden County</button>
          <button>Essex County</button>
          <button>Franklin County</button>
          <button>Grand Isle County</button>
          <button>Lamoille County</button>
          <button>Orange County</button>
          <button>Orleans County</button>
          <button>Rutland County</button>
          <button>Washington County</button>
          <button>Windham County</button>
          <button>Windsor County</button>
        </div>
      </div>
    );
  }
}
const rootElement = document.getElementById('root');
ReactDOM.render(<Livemap />, rootElement);
