import React from 'react';
import { Link } from 'react-router-dom';

import '../css/Footer.css';

 const PointInfo = () => {

    return (
        <>
            <div className='jm-challenge-point-info'>
                <h2>포인트 지급</h2>
                <div className='jm-challenge-point'>
                    <p>
                        <span> 내 달성율 100% 배팅포인트의 120% 지급</span>
                    </p>
                    <p>
                        <span> 내 달성율 85%이상 배팅포인트의 100% 지급</span>
                    </p>
                    <p>
                        <span> 내 달성율 85%미만 배팅포인트 %삭감</span>
                    </p>
                </div>
            </div>
        </>
    );

}

export default PointInfo;