
import { useNavigate } from 'react-router-dom';

export const StepNav = ({ idx }) => {

    const navigate = useNavigate();

    const steps = [
        { title: "1. 방 유형", link: '/genebang/step1' },
        { title: "2. 카테고리", link: '/genebang/step2' },
        { title: "3. 제목/이미지/설명", link: '/genebang/step3' },
        { title: "4. 세부설정", link: '/genebang/step4' },
        { title: "5. 기간", link: '/genebang/step5' },
        { title: "6. 미션/최종평가", link: '/genebang/step6' },
        { title: "7. 평가 요일", link: '/genebang/step7' },
        { title: "8. AI 추천 미션", link: '/genebang/step8' },
    ];

    const handleNavigate = (link) => {
        navigate(link);
    };

    return (
        <div id="stepNav">
            <ul>
                {steps.map((step, index) => (
                    <li
                        key={index}
                        className={idx === index + 1 ? "active" : ""}
                        onClick={() => handleNavigate(step.link)}
                    >
                        {step.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}