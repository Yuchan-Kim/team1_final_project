// src/utils/coordinateConversion.js
// import proj4 from 'proj4';
// import './proj4Definitions'; // 좌표계 정의 파일 임포트

/**
 * mapx와 mapy를 위도와 경도로 변환
 * @param {number} mapx - Naver API의 mapx 값 (경도 * 1e7)
 * @param {number} mapy - Naver API의 mapy 값 (위도 * 1e7)
 * @returns {{ latitude: number, longitude: number }}
 */
export const convertMapXYToLatLng = (mapx, mapy) => {
    const latitude = parseFloat(mapy) / 1e7;
    const longitude = parseFloat(mapx) / 1e7;
    return { latitude, longitude };
};

// 테스트 함수
const testConvert = () => {
    const mapx = 1270594274; // 코엑스의 mapx
    const mapy = 375116620;  // 코엑스의 mapy
    const { latitude, longitude } = convertMapXYToLatLng(mapx, mapy);
    console.log('Test Latitude:', latitude, 'Test Longitude:', longitude);
};

testConvert();
// 예상 출력: Test Latitude: 37.511662 Test Longitude: 127.0594274
