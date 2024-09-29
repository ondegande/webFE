import React, { useEffect, useRef } from 'react';

const { kakao } = window;

function MakingCourseMap({ courses, mapId }) {
  const markersRef = useRef([]);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!courses || courses.length === 0) return;

    const mapContainer = document.getElementById(mapId);

    if (!mapRef.current) {
      const mapOption = {
        center: new kakao.maps.LatLng(courses[0].lat, courses[0].lng),
        level: 3,
      };

      mapRef.current = new kakao.maps.Map(mapContainer, mapOption);
    } else {
      mapRef.current.setCenter(new kakao.maps.LatLng(courses[0].lat, courses[0].lng));
    }

    const map = mapRef.current;
    const bounds = new kakao.maps.LatLngBounds();
    const linePath = [];
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    let activeMarker = null;

    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    courses.forEach((course, index) => {
      const markerPosition = new kakao.maps.LatLng(course.lat, course.lng);

      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
      const imageSize = new kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, (index * 46) + 10),
        offset: new kakao.maps.Point(13, 37),
      };

      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      marker.setMap(map);
      markersRef.current.push(marker);

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.setContent(`<div style="padding:5px;">${course.name}</div>`);
        infowindow.open(map, marker);
      });

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        if (activeMarker) {
          infowindow.close();
        }
        infowindow.setContent(`<div style="padding:5px;">${course.name}</div>`);
        infowindow.open(map, marker);
        activeMarker = marker;
      });

      linePath.push(markerPosition);
      bounds.extend(markerPosition); 
    });

    polylineRef.current = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#4373D0',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    polylineRef.current.setMap(map);
    map.setBounds(bounds);
  }, [courses, mapId]);

  return <div id={mapId} style={{ width: '100%', height: '30vh' }}></div>;
}

export default MakingCourseMap;
