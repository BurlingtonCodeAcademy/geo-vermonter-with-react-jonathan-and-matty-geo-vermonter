import React from 'react';
import ReactDOM from 'react-dom';
import Leaflet from 'leaflet';
import './styles.css';
import countyBorders from './countyBorders.js';
import counties from './counties.js';

function WinningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return <div className="winning">You won the game!</div>;
}

class Livemap extends React.Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.map = null;
    this.lat = 43.85;
    this.long = -72.6;
    this.viewLat = this.lat;
    this.viewLong = this.long;
    this.myMarker = null;
    this.myCounty = 'Addison County';
    this.myTown = 'Middlebury';
    this.showHide = true;
    this.state = { showWinning: false };
    this.toggleWinner = this.toggleWinner.bind(this);
    this.guess = this.guess.bind(this);
    this.score = 0;
  }
  componentDidMount() {
    this.map = Leaflet.map(this.mapRef.current, {
      zoomControl: false
    }).setView([this.lat, this.long], 8);
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
      fillOpacity: '0.175',
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

  drawButtons() {
    let array = [];
    for (let county of counties) {
      let idName = county.name.split(' ').join('-');
      array.push(<button id={idName} key={idName} className="hidden" onClick={() => this.guess(county.name)}>{county.name}</button>);
    }
    return array;
  }

  updateScore(howMuch) {
    this.score = this.score + howMuch;
    if (this.score <= 0) {
      this.score = 0;
    }
    document.getElementById("score").innerHTML = this.score;
  }

  toggleWinner() {
    this.setState(prevState => ({
      showWinning: !prevState.showWinning
    }));
  }

  randomCountyIndex() {
    let index = Math.floor(Math.random() * counties.length);
    return index;
  }

  moveAndDrawLine(latPlus, longPlus, color) {
    let pointA = new Leaflet.LatLng(this.viewLat, this.viewLong);
    this.viewLat = +this.viewLat + latPlus;
    this.viewLong = +this.viewLong + longPlus;
    let pointB = new Leaflet.LatLng(this.viewLat, this.viewLong);
    let pointList = [pointA, pointB];
    this.updateScore(-1);

    let myPolyline = new Leaflet.polyline(pointList, {
      color: color,
      weight: 4,
      opacity: 0.5,
      smoothFactor: 1
    });

    myPolyline.addTo(this.map);
    this.map.panTo(new Leaflet.LatLng(this.viewLat, this.viewLong));
  }

  goReturn(zoom) {
    this.viewLat = this.lat;
    this.viewLong = this.long;
    this.map.flyTo(new Leaflet.LatLng(this.lat, this.long), zoom);
  }

  randomCounty() {
    let countyIndex = this.randomCountyIndex();
    this.lat = counties[countyIndex].center[0];
    this.long = counties[countyIndex].center[1];
    this.myCounty = counties[countyIndex].name;
    this.myTown = counties[countyIndex].town;
    document.getElementById('cheat-sheet').innerHTML = this.myCounty.split(' ').join('-');
  }

  toggleHide() {
    this.showHide = !this.showHide;

    document.getElementById('start').className = this.showHide ? 'button' : 'hidden';

    ['quit', 'north', 'west', 'east', 'south', 'return'].forEach((id) => {
      document.getElementById(id).className = this.showHide ? 'hidden' : 'button';
    });

    for (let i = 0; i < 14; i++) {
      document.getElementById(counties[i].name.split(' ').join('-')).className = this.showHide ? 'hidden' : 'button';
    };

  }

  start() {
    this.randomCounty();
    this.map.setView([this.lat, this.long], 13);
    this.goReturn(15);
    this.toggleHide();
    this.hideInfo();
    this.updateScore(-150);
    this.updateScore(150);
    this.setState(prevState => ({
      showWinning: false
    }));
    if (this.myMarker) {
      this.myMarker.remove();
    }
  }

  end() {
    this.map.flyTo([43.85, -72.6], 8);
    this.myMarker = Leaflet.marker([this.lat, this.long]).addTo(this.map);
    this.myMarker.bindPopup(`${this.myTown} in ${this.myCounty}`).openPopup();
    this.toggleHide();
  }

  hideInfo() {
    ['latitude', 'longitude', 'county', 'town'].forEach((id) => {
      document.getElementById(id).innerHTML = '?';
    });
  }

  showInfo() {
    document.getElementById('latitude').innerHTML = (Math.round(this.lat * 100) / 100);
    document.getElementById('longitude').innerHTML = (Math.round(this.long * 100) / 100);
    document.getElementById('county').innerHTML = this.myCounty.split(' ')[0];
    document.getElementById('town').innerHTML = this.myTown;
  }

  guess(county) {
    if (county === this.myCounty) {
      this.toggleWinner();
      this.showInfo();
      this.end();
    } else {
      this.updateScore(-10);
    }
  }

  quit() {
    this.updateScore(-150);
    this.showInfo();
    this.end();
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
              <button id="north" className="hidden" onClick={() => this.moveAndDrawLine(0.0025, 0, 'yellow')}>
                North
						</button>
            </div>
            <div id="map-middle">
              <div id="westButton">
                <button id="west" className="hidden" onClick={() => this.moveAndDrawLine(0, -0.0025, 'cyan')}>
                  West
							</button>
              </div>
              <div id="map">
                <div id="returnButton">
                  <button id="return" className="hidden" onClick={() => this.goReturn()}>
                    Return
								</button>
                </div>
              </div>
              <div id="eastButton">
                <button id="east" className="hidden" onClick={() => this.moveAndDrawLine(0, 0.0025, 'orange')}>
                  East
							</button>
              </div>
            </div>
            <div className="row">
              <div className="balancer" />
              <div id="southButton">
                <button id="south" className="hidden" onClick={() => this.moveAndDrawLine(-0.0025, 0, 'red')}>
                  South
							</button>
              </div>
              <div id="startDiv">
                <button id="start" className="button" onClick={() => this.start()}>
                  Start
							</button>
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <div id="status">
            <div className="bold" id="gv-title">
              GEOVERMONTER
          </div>
            <div id="info">
              <div>
                Latitude: <span id="latitude">?</span>
              </div>
              <div>
                Longtitude: <span id="longitude">?</span>
              </div>
              <div>
                County: <span id="county">?</span>
              </div>
              <div>
                Town: <span id="town">?</span>
              </div>
            </div>
            <div>Your score is: <span id="score" className="blink-me">0</span>
            </div>
            <div>
              <WinningBanner warn={this.state.showWinning} />
            </div>
          </div>
          {this.drawButtons()}
          <button id="quit" className="hidden" onClick={() => this.quit()}>I Give Up</button>
          <div id="cheat-sheet" className="hidden"></div>
        </div>
      </div>
    );
  }
}
const rootElement = document.getElementById('root');
ReactDOM.render(<Livemap />, rootElement);
