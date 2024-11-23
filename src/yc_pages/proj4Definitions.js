// src/utils/proj4Definitions.js
import proj4 from 'proj4';

// TM128 (EPSG:5179) 좌표계 정의
proj4.defs("EPSG:5179", "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=1 +x_0=200000 +y_0=5000000 +ellps=GRS80 +units=m +no_defs");

// Web Mercator (EPSG:3857) 좌표계 정의
proj4.defs("EPSG:3857", "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
