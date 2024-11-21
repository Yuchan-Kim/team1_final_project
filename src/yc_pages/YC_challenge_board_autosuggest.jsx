// src/pages/YC_challenge_board_autosuggest.jsx
import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import "../yc_assets/yc_css/yc_css_challenge_board_autosuggest.css";

const PlaceAutosuggest = ({ onPlaceSelect }) => {
    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // 환경 변수에서 API 키 가져오기
    const NAVER_CLIENT_ID = '8s4sb9kldr';
    const NAVER_CLIENT_SECRET = 'BjJL7e3GMMIZj5Sh7SVRmNdwvEA10To4UYXIOAlf';

    // 장소 검색 요청
    const getSuggestions = async (value) => {
        const inputValue = value.trim();
        const inputLength = inputValue.length;

        if (inputLength === 0) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get("https://naveropenapi.apigw.ntruss.com/map-place/v1/search", {
                params: { query: inputValue },
                headers: {
                    "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
                    "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
                },
            });

            if (response.data && response.data.places) {
                setSuggestions(response.data.places);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("장소 검색 중 오류 발생:", error);
            setSuggestions([]);
        }
    };

    // 입력 변화 핸들러
    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    // 제안 목록을 갱신하는 함수
    const onSuggestionsFetchRequested = ({ value }) => {
        getSuggestions(value);
    };

    // 제안 목록을 비우는 함수
    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    // 제안 항목 렌더링
    const renderSuggestion = (suggestion) => (
        <div>
            {suggestion.place_name} ({suggestion.road_address ? suggestion.road_address : suggestion.address_name})
        </div>
    );

    // 선택된 제안 항목 핸들러
    const onSuggestionSelectedHandler = (event, { suggestion }) => {
        onPlaceSelect({
            name: suggestion.place_name,
            address: suggestion.road_address ? suggestion.road_address : suggestion.address_name,
            latitude: parseFloat(suggestion.y),
            longitude: parseFloat(suggestion.x),
        });
    };

    const inputProps = {
        placeholder: "장소를 입력하세요.",
        value,
        onChange: onChange,
    };

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.place_name}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={onSuggestionSelectedHandler}
            inputProps={inputProps}
        />
    );
};

export default PlaceAutosuggest;
