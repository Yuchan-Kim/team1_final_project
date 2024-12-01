import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/StepNav.css';

export const StepNav = ({ idx }) => {
    const navigate = useNavigate();


    const steps = [
        { title: "1. 방 유형", link: '/genebang/step1' },
        { title: "2. 카테고리", link: '/genebang/step2' },
        { title: "3. 제목/이미지/설명", link: '/genebang/step3' },
        { title: "4. 세부설정", link: '/genebang/step4' },
        { title: "5. 기간", link: '/genebang/step5' },
        { title: "6. 평가 요일", link: '/genebang/step7' },
        { title: "7. 미션/최종평가", link: '/genebang/step6' },
        { title: "8. AI 추천 미션", link: '/genebang/step8' },
    ];

    return (
        <div id="jm-stepNav">
            <ul>
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={idx === index + 1 ? "jm-active" : "jm-disabled"}
                    >
                        {step.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};
