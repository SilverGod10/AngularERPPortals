import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment'
@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  s:any;
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 13.05;
  lng = 80.21;
  constructor() {
  }

  ngOnInit(): void {
    this.map = new mapboxgl.Map({
      accessToken:environment.mapbox.accessToken,
      container: 'map',
      style: this.style,
      zoom: 18,
      center: [this.lng, this.lat]
  });
  // Add map controls
  this.map.addControl(new mapboxgl.NavigationControl());
  }

}
