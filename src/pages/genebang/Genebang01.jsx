//import 라이브러리

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../../css/reset.css';

const Genebang01 = () => {

    /*---라우터 관련-------------------------------*/

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    /*---일반 변수--------------------------------*/

    /*---일반 메소드 -----------------------------*/

    /*---훅(useEffect)+이벤트(handle)메소드-------*/

    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("sd");

    const getMusicList = () => {
        const criteria = { page: page, keyword: keyword };
        //console.log(criteria);
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/test`,
            params: criteria,
            responseType: 'json',
        }).then(response => {

            // const apiData = response.data.apiData || {};
            console.log('연결완');

        }).catch(error => {
            console.log(error);
        });
    };


    useEffect( ()=>{

        console.log("마운트 온 하고 있는거 맞아?");

        
        getMusicList();



    }, [] );

    return (

        <>

            <p>안녕하게요</p>
            <button>방생성</button>

        </>

    );

}

export default Genebang01;