// src/components/YCStepNav.jsx

import React from 'react';

import '../css/reset.css';
import '../yc_assets/yc_css/yc_step.css';

// StepNav 컴포넌트
export const YCStepNav = ({ currentStep, onStepChange }) => {

    const steps = [
        { title: "카테고리", step: 2 },
        { title: "제목/이미지/설명", step: 3 },
        { title: "세부설정", step: 4 },
        { title: "기간", step: 5 },
        { title: "미션/최종평가", step: 6 },
        { title: "평가 요일", step: 7 },
    ];

    return (
        <div id="yc_stepNav">
            <ul>
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={currentStep === step.step ? "active" : ""}
                        onClick={() => onStepChange(step.step)}
                        style={{ cursor: 'pointer' }} // 클릭 가능함을 시각적으로 표시
                        aria-current={currentStep === step.step ? "step" : undefined} // 접근성 개선
                        role="button" // 접근성 개선
                        tabIndex={0} // 키보드 접근성 개선
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                onStepChange(step.step);
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
