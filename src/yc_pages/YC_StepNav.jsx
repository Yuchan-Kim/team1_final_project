// src/components/YCStepNav.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../css/reset.css';
import '../yc_assets/yc_css/yc_step.css';

// StepNav 컴포넌트
export const YCStepNav = ({ idx }) => {

    const navigate = useNavigate();

    const steps = [
        { title: "카테고리", link: '/ycstep02' },
        { title: "제목/이미지/설명", link: '/ycstep03' },
        { title: "세부설정", link: '/ycstep04' },
        { title: "기간", link: '/ycstep05' },
        { title: "미션/최종평가", link: '/ycstep06' },
        { title: "평가 요일", link: '/ycstep07' },
    ];

    // 네비게이션 핸들러
    const handleNavigate = (link) => {
        navigate(link);
    };

    return (
        <div id="yc_stepNav">
            <ul>
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={idx === index ? "active" : ""}
                        onClick={() => handleNavigate(step.link)}
                        style={{ cursor: 'pointer' }} // 클릭 가능함을 시각적으로 표시
                        aria-current={idx === index ? "step" : undefined} // 접근성 개선
                        role="button" // 접근성 개선
                        tabIndex={0} // 키보드 접근성 개선
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleNavigate(step.link);
                            }
                        }}
                    >
                        {step.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}
