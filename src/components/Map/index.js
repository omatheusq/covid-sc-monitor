import React, { useEffect, useLayoutEffect, useState } from 'react';
import * as d3 from 'd3'
import * as topojson from "topojson-client";
import { useDispatch, useSelector } from "react-redux";
import api from '../../services/api'

import mapTopology from '../../data/map.json';
import './style.css'

export default function Map() {

  const radiusScale = d3.scaleSqrt();
  const margin = { top: 50, left: 50, right: 50, bottom: 50 };
  const [selectedCity, setSelectedCity] = useState('');
  const [covidData, setcovidData] = useState([]);

  const dispatch = useDispatch()
  const { citiesCoordinates } = useSelector(state => ({ ...state.coordinatesReducer }))

  useEffect(() => {
    api.get(`/city`)
      .then(res => {
        setcovidData(res.data)
      })
  }, []);

  useEffect(() => {
    dispatch({
      type: "SET_CITY",
      city: selectedCity
    })

  }, [selectedCity]);

  useEffect(() => {
    let maxValue = d3.max(covidData.filter(d => d.cityIbgeCode != '42').map(d => parseFloat(d.confirmedPer100k)))
    if (isNaN(maxValue) === false) {
      citiesCoordinates.forEach(c => {
        let data = covidData.find(d => d.cityIbgeCode == c.ibgeCode)
        if (data) {
          c.caseCount = parseInt(data.caseCount);
          c.deathCount = parseInt(data.deathCount);
          c.confirmedPer100k = parseFloat(data.confirmedPer100k);
        } else {
          c.caseCount = 0;
          c.deathCount = 0;
        }
      })

      dispatch({
        type: "DESELECT_CITY"
      })

      radiusScale
        .domain([0, maxValue])
        .range([0, 30]);

      createMap(
        document.getElementById('map').clientWidth,
        document.getElementById('map').clientHeight,
        mapTopology,
        citiesCoordinates
      )
    }
  }, [covidData]);

  useLayoutEffect(() => {
    function updateSize() {

      resizeMap(
        document.getElementById('map').clientWidth,
        document.getElementById('map').clientHeight
      )
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  let resizeMap = (divWidth, divHeight) => {
    let width = divWidth - margin.left - margin.right;

    d3.select("g").attr("transform", "scale(" + width / 900 + ")");
  }

  var createMap = (divWidth, divHeight, data, citiesCodinates) => {

    let height = divHeight - margin.top - margin.bottom,
      width = divWidth - margin.left - margin.right;

    let svg = d3.select('#map')
      .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.left + margin.right)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.right})`);

    let defs = svg.append("defs");
    var stripes = defs.append("pattern")
      .attr("id", "stripes")
      .attr("width", 8)
      .attr("height", 10)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("patternTransform", "rotate(45 50 50)")

    stripes.append("line")
      .attr("stroke", "rgb(219, 217, 217)")
      .attr("stroke-width", 5)
      .attr("y2", 20);

    let projection = d3.geoMercator()
      .center([-50.80, -27.61])
      .translate([width / 2, height / 2])
      .scale(10000)

    let path = d3.geoPath()
      .projection(projection);

    let cities = topojson.feature(data, data.objects['42']).features;

    console.log(citiesCodinates)

    svg.selectAll('.city')
      .data(cities)
      .enter().append('path')

      .attr('class', 'city')
      .attr('d', path)
      .on('mouseover', function () {
        d3.select(this).classed('city-hovered', true)

      }).on('mouseout', function () {
        d3.select(this).classed('city-hovered', false)
      })
      .on('click', function (d) {
        let city = citiesCodinates.find(c => c.ibgeCode === d.properties.cod)
        setSelectedCity(city)
        let selecteds = d3.select('#map').selectAll('.city.city-selected')
        selecteds.nodes().forEach((s) => {
          d3.select(s).classed('city-selected', false)
        })
        d3.select(this).classed('city-selected', true)
      })

    svg.selectAll('.city-circle')
      .data(citiesCodinates)
      .enter().append("circle")
      .attr('class', 'circle')
      .attr("cx", function (c) {
        var coords = projection([c.latLng.lng, c.latLng.lat]);
        return coords[0]
      })
      .attr("cy", function (c) {
        var coords = projection([c.latLng.lng, c.latLng.lat]);
        return coords[1]
      })
      .attr("r", d => { return radiusScale(d.confirmedPer100k) })
      .on('click', function (d) {
        let city = citiesCodinates.find(c => c.ibgeCode === d.ibgeCode)
        setSelectedCity(city)
      })
  }

  return (
    <div id="map"></div>
  )
}