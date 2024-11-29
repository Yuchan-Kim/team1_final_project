import React from 'react';
import { useNavigate } from 'react-router-dom';

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

    /*---클릭 비활성화---------------------------*/
    // onClick 핸들러 제거하거나, 조건부로 활성화
    // 여기서는 클릭을 완전히 비활성화합니다.

    return (
        <div id="stepNav">
            <ul>
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={idx === index + 1 ? "active" : "disabled"}
                        /* onClick={() => handleNavigate(step.link)} */  /* 클릭 비활성화 */
                    >
                        {step.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
