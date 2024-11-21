// src/pages/YC_challenge_board_NaverMap.jsx
import React from "react";
import { RenderAfterNavermapsLoaded, NaverMap as Map, Marker } from "react-naver-maps";
import "../yc_assets/yc_css/yc_challenge_board_navermap.css";

const NaverMap = ({ place }) => {
    const NAVER_MAP_KEY = "8s4sb9kldr";

    if (!NAVER_MAP_KEY) {
        console.error("Naver Client ID is not defined in environment variables.");
        return null;
    }

    return (
        <RenderAfterNavermapsLoaded
            ncpClientId={NAVER_MAP_KEY}
            error={<p>지도를 불러오는데 실패했습니다.</p>}
            loading={<p>지도를 불러오는 중입니다...</p>}
        >
            <Map
                mapDivId={"maps-getting-started-uncontrolled"} // default: react-naver-map
                style={{
                    width: "100%", // 네이버 지도의 가로 길이
                    height: "400px", // 네이버 지도의 세로 길이
                }}
                defaultCenter={{ lat: 37.5665, lng: 126.9780 }} // 기본 센터 위치 (서울시청)
                defaultZoom={15}
                center={place ? { lat: place.latitude, lng: place.longitude } : { lat: 37.5665, lng: 126.9780 }}
            >
                {place && (
                    <Marker
                        position={{ lat: place.latitude, lng: place.longitude }}
                        title={place.name}
                    />
                )}
            </Map>
        </RenderAfterNavermapsLoaded>
    );
};

export default NaverMap;
