import React, { useState } from 'react';
import TopHeader from "../include/DH_Header.jsx";
import ChatRoom from "../../yc_pages/YC_challenge_chatroom.jsx";
import { Doughnut, Line, Bar } from "react-chartjs-2"; 
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Filler,
} from "chart.js";


import '../css/Mission.css';
import '../css/Modal.css';



import Sidebar from "../../yc_pages/YC_challenge_sidebar.jsx";
import Header from "../../yc_pages/JMYC_challenge_header.jsx";

const Mission = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingRule, setIsEditingRule] = useState(false); // 룰셋 수정 모드 상태
  const [ruleText, setRuleText] = useState("산 근처 공원에서 런닝 하실때는 야생의 김유찬을 조심하세요."); // 초기 룰셋 텍스트

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "날짜",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "전체 달성률 (%)",
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
      },
      title: {
        display: false,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
  };

  const overallLineChartData = {
    labels: ["24-04-01", "24-04-05", "24-04-10", "24-04-15", "24-04-20", "24-04-25", "24-04-30"],
    datasets: [
      {
        label: "전체 달성률",
        data: [50, 55, 60, 65, 70, 75, 80],
        fill: true,
        backgroundColor: "rgba(33, 150, 243, 0.2)",
        borderColor: "#2196f3",
        tension: 0.4,
        pointBackgroundColor: "#2196f3",
      },
    ],
  };

  const handleOpenModal = () => setIsModalOpen(true);

  const handleEditRule = () => {
    setIsEditingRule(true);
  };

  const handleSaveRule = () => {
    setIsEditingRule(false);
  };

  const handleRuleChange = (event) => {
    setRuleText(event.target.value);
  };

  const missions = [
    { title: "스트레칭 하기", status: "제출", description: "인증사진은 이렇게 넣어라 이렇게 안넣으면 승인 거절할거니까 알아서들 잘해라" },
    { title: "500미터 걷기", status: "제출", description: "인증방법 설명" },
    { title: "물 마시기", status: "제출", description: "인증방법 설명" },
    { title: "눈 마사지", status: "제출", description: "인증방법 설명" },
    { title: "눈 마시기", status: "제출", description: "인증방법 설명" }
  ];

  const [fileInputs, setFileInputs] = useState([{}]);
  const [previews, setPreviews] = useState([]);

  const handleAddFileInput = () => {
    setFileInputs([...fileInputs, {}]);
  };

  const handleRemoveFileInput = (index) => {
    setFileInputs(fileInputs.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleFileChange = (event, index) => {
    const files = [...fileInputs];
    files[index] = event.target.files[0];
    setFileInputs(files);

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...previews];
      newPreviews[index] = reader.result;
      setPreviews(newPreviews);
    };
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFileInputs([{}]);
    setPreviews([]);
  };

  return (
    <>
      <TopHeader/>
    <div className="jm-bady">
      {/* Sidebar */}

        <Sidebar />


      {/* Main Content */}
      <div className="jm-mission-body">
      <Header/>

        <h2 className="jm-sub-tatle">미션 제출</h2>

        {/* Progress Bar */}
        <span className="jm-my-count">내 달성율 79%</span>
        <div className="jm-progress-bar">
          <div className="jm-progress" style={{ width: '75%' }}></div>
        </div>

        {/* 룰셋 수정 가능 */}
        <div className='jm-roolset'>
          {isEditingRule ? (
            <div className="jm-roolset-contents-box">
              <h3>유의 사항</h3>
            <textarea
                placeholder={ruleText}
                value={ruleText}
		            onChange={handleRuleChange}
            ></textarea>
            
            <div className="jm-btn-updatimg">
            <button onClick={handleSaveRule}>
                등록
            </button>
            </div>
          </div>
          ) : (
            <div>
              <div className='jm-roolset-contents-box'>
              <h3>유의 사항</h3>
              <span>{ruleText}</span>
              <div className="jm-btn-updatimg">
                <button onClick={handleEditRule}>
                  수정
                </button>
              </div>
              </div>
            </div>
          )}
        </div>
        
        <h2 className="jm-todo">할일</h2>
        {/* Mission List 컨테이너 */}
        <div className="jm-mission-list">
          <div className="jm-missions">
            {missions.map((mission, index) => (
              <div key={index} className="jm-mission">
                <div className="jm-mission-name">
                  <h3>{mission.title}</h3>
                  <button onClick={handleOpenModal}>{mission.status}</button>
                </div>
                <div className="jm-mission-img">
                  <img src="data:image/jpeg;base64,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" alt="미션 이미지" />
                </div>
                <div className='jm-mission-comment-container'>
                  <p>{mission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final Goal Section */}
        <div className="jm-final-goal">
          <h2 className='jm-final-goal-tatle'>최종 목표</h2>
          <div className="jm-goals">
            <div className="jm-goal-mission">
              <div className="jm-mission-name">
                <h3>5키로 빼기</h3>
                <button onClick={handleOpenModal}>제출</button>
              </div>
              <div className="jm-mission-img">
                <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEhAQEBAVEBAQDw8QEBAQDw8PEA8VFREWFhUVFRUYHSggGBolGxUWITEhJSktLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGi0dHR0rLS0rLSsrLS0tLS0tLSstLS0tLSstLSstKystLS0tLS0tLSstKy0rLS0tLSstLTctLf/AABEIAO8A0wMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAADAQIEBQYABwj/xAA/EAACAQIDBAgFAgUDAgcAAAABAgADEQQSIQUxQVEGEyJhcYGRoQcyscHRQlIUI2JygjNTg0OiFiREkrLh8P/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACQRAQEAAgICAQUAAwAAAAAAAAABAhEDIRIxQQQTIjJRFCNh/9oADAMBAAIRAxEAPwDYAR1pwEUQZlAigTgI4CI3Wi2ixQIAlotooEW0Bs20cBHATrQIlp0W0W0YNnWjrTrQBs60dadaAMMQiPtEtAGWiWjyIloAMiNIhbRpENgMxI8iNIjAZEbCkRpEAHOjrToAUCLaKBFAiBQIs4COAiDrR1p0cBAEAiiKBHAQM20W0dKLph0mp7Oo9Ywz1HJWjSvbO1tSTwUcTAJO39uYfBU+srva+iINXqHko+88s2t8RMdWY9QwwtL9IVFqVT3szAjyHrM5tHadfaFZq+Ia53Kq3CovBUB3CNw2zqlVwqZ1BNsxUlR5iPqe1zFfYP4h7Rpb6qYgC9xVpKCPNMs1nQz4iHF1hh8TTSm736upTzBSd+VlJNtON5gMV0cr08wZSSRrlF72lRWwtWlrZlOvAqQLWMe5fQuFnt9KUqiuMyMHXdmVgw9RHWnzNs/auIw7h6NZ6TXv2HZQfEbj5z2z4ddLTtCkyVioxNG2fLYCqp3OF4HgR4c4rEWNbaIRCWiEREGREtHkRLQBlohEfaIRGAiI0iFIjSIAIxphCI0iMGWnRbRYEfHARBHrEbgI4To4CIOAjgIoEcIAgEW0UCOAgZoE8H6eY98btCsgN0o1Gw9EcAENmPiXDH05T3xV1nz9sizY+s2++JrkHneq2sN6m18c3Ww6K9C1VQ9Y5ibHKN021DAU0ACoAB3RcGtlHhJZacttvt2dT0hvSHKUu1sBTdSGQHyE0Dayr2huk3pWLybpF0bCXalu1JXlKDZWOq4Wslak2SpTYEakA2OqtzU7iJ6Ttsaes802itnPiZ08OVs7Y8+EncfTWBxArUqVVRZatNKgHIMoa3vC2lD8O8Wa2zcGx1K0jSP/ABMaf0UTQ2luQMiJaEIjSIAwiNIhLRLQAZEaYQiNIgQREaRCNGERgMidH2nRg4RwE4RwiBQI8CIojxEbgI4CcBHgRAlotototoyMqNlVm5KT6C88E+HGHNXEZyLhF6xjbidw8bz3rFqDTqAmwNNwTyGU6zzD4WYAJQqtbU1At+eVR+ZOd/GtuGfk0/8A5o6pkUftbQgd/fHUcZiM1nVbX3rHV9nhn6yp/MVRZaT5ur8SBvPjKno5s/E06lbraitTZiyKilVpi+4A8Jz76dknbR1HyqTMptevi3NqIWx4nSaDb7lcOxG8AzOYOkz03aplbNRy0kbOyI5B7bqLZuFhfhJ32qTq1nNqU8UB/NKnuBmQ2zRIIa1g3sZsqGwatPKDUNXQ5zkyITfQgc5V9KcBlpn+kg8uM2wy70z5Mfx29A+C2Kz4B6f+ziqijwdVqfVmm9InnHwNpkYfF3416bAW4dXa9++3tPSiJtXDlNUK0QiEIiWgkIiNMKRGkRGGRG2hDGmMgiI0iEIjTGA7To6dAFEcIgj1EVBwEeBEEeBEbgI4RQI4CAII60UCOAgQVeiHVkO5lK+otMl0cwPUI9K1slaqPe49iJtLSixq5Kj6bzf1AmfI6OC+4JlEG5A3SLUxXAb4HHU6j02WnU6tyLZ7AleZF9L+Ux26piB0mqWonXfKvo9iLgqdCPpInSTAYk0lRapYrYGococ9+gtfykLYxem4Z2v2FS3EkfqJ5+UVa4zprcUAAT3TA7eOcVgf9t/Wxt72mrx2NupAmWfDVKpdaaNUcqeyilmtcXIA8Y8L2m49dt78KcEKeBWpxrOx8An8u3qrHzmwIkDo1s84fC4eiRZkp9oftLEsR5E28pZlZ04+nnct3naERGEQpEaRKZhERpEKRGEQAZEYRCkRhEDDIjDCGNIgDLTos6MnAQgEaBHqIjPUR4jRHgQIojwIiiPAiDgI8CcojgIBwErttUbqrcjlPnu9/rLQCJVpBlKncwIMnLuaXhfG7ZJqdvGU+G2s1V66KBRXDv1dSriDlW9r3A5WN73l4ykMUb5lNj+ZC2hQGt1zKws4tf1HGc/p6GN2h7QpuULLiqDDIX0I7VuWu7vmLxe1AKlOncFqhGXq+0PP0l1j9j4PTMEIU6ZQQfcSqJpmrnSnlCjIrH5go4Dl94dNvGye1s2idrUkTQ/DbAdvEYgjcBSTzOZvovrMliK9yFHAAHxnoPw4q58K9ty4h1HfZE1j452w+oy/Bp7RpELaIROh5wJEaRCkRpEZBGDIhWEaRKIIxjQhjCIjCIiER5jTAzJ0W0WBEEIsYsIogZ4jwI0R6xEcohFEasIBGCgRwE4CO3SabgI4CR3xQGg1PtIG1sY60nYGxCki2ltIGB0hZFemRbPYhwCL2Fstx5mQmQOJntlVbuwJuWF7k3Jtvv6y2qFlHZMw5OsrHXw94SoOL2QDcljbylBjsGlHcbsdwlrjtrOuh08iZmsZiyxJFx/Ud/lyme3XN/KHia1rgHtH5u7u8ZpehvTShs+maOIpuVqVWcVKeVsvZUEMpINtN4v4TJhLmVm1HDNYfoBv4nhNeLvJh9Rrwr6P2btOhiUWrQqrURxdSDr5rvB7jJRE8R6H4JuqVubtY9w0+oM3WDrVk0FR/AsxHoZvY4NNkRGkSkw216ikq/bAtY7j6yyTaNM7zl8YhoZhBkQiuraqQR3EGIwjSCwgyIYiMYSiBYRhhWEGwgZkWdOgHLCLBrCgRA9YQCMWEEAeonPUVd58uMZUfKO87pHZLa7+cRyCti76AW74CoxzC5vfnHZRGYg2Cnk0StHIe0fCdi6QZSp3EWg8KbknmZKYQDznG0HoVCNzIdDzHA+En4bbVMi1TsHnvUzT7S2ZTrizaMPlcbx+R3TKY7oxWW+VRUHNCAfNTHljjn7LHLLD0i7Sr0W1Dr6iZXaOLS5Cm45iXeI2FW3dTV8qbGQ26L4g69SwHNyE+sj7GM+W/wDlZ/xma+LY6J2Rz/UfxH7L2ZUruERbk7zwUcSTNds7oSzm9Rgqjfk18rmbHZuyKWHXLTTKOJ3lu8maTxx9M888s/2Rdk7OFNEQDRAAO/vlthqNzflCMllJh8NTsItpCOH7XiILDKHLn9KsUUcyN5liwsCeQMgbCW9IHmWb1YmLZgYyt1RuGyWFyQde4ASz2RtPr86lSr08t7i2YMLhgOG6UOz6Qr1KtZ9VNRsl9yougNuem+Q9mbRK4sV91OtU6r/A9lT6qDHOyyjcERjCFaDMcQC0YwhWg2jAc6LOiBBCLBiEEAIsKsEsHjK+RdPmbQd3MwItRrt3DSPB4QFJdIS/toZNaRx+8Fjfl8xCpqPaBxe4DviM7CiHc6wVAR1Y6iMizhEEcBAGubSrrA1Gy8OMm4xtLQeDp7zACdWFAAjMkkMIgWABrLoB3iHRbRmIHyjvhWMAZVPZb+0/SVdOpkwgy7ygVfFtPvLKoewf7T9JRYOuDSog6hO2wH6iNFXxJPsZNVj6OxiZKaYWnozqM5H6E4+Z3esp+kICZKKf9MB3I/SbWRfS5l45NK50fFVjcDgnK/8ASBKfauHFOnqbsxJJPzO29mMvEsml6PdIqWLunyV0HbQn5h+5eY+nvLczwnEY98PiEq02KuoVwR3XHppPaNibTXF0KdddM69pf2sNGX1vKsZpTQbQrQTQAc6dOiBBCLBiEWFAqyvxzXqqP2ge+v4lgJW4oWrHvVT7W+0YiWhisba+sascOUhZgbW0dXFxGVE9t0IsR0tE6RjG5nJpHxk4Rwga9YIL7+6Jg8StVA6G4N/EEGxB84t96Pxuth407oTDDSCxu8SRQGkYOjlEy238ZUo1gUJBIHgw8OPKTdn9IFZkp1cqPU0Ug9lmtutwMz+5N6a3gy8ZlO1xvbwjcS9tOceumsiE5n7hNGIuKbLSY/0n6TO9HGJW4FyCct9y/wBR+0sulGLFKj3tYAc5G6MU8tEMd7XNucm+1z9bU10SiGqOczHex+ZuQEz+3GbLmf8A1aosq/7VMb/M/eaCsoF6tU3y6qOA8O+UdXDvXZnbQsLAfsSXEvOdvoQ1M2+ZX9mFvqZvPg/jS1LE0TuR6dQf5gqf/gJkOl9RWYlfkR8i+AW32mi+DCHNjG4BKC+ZLn7TT4RXpjQZhHgzJSGYk6dEZiwqwKmFUxgZZFxtPto3MFfe4+pklTA4zevn9oqISny4jdH2v4xnIjfHk8ZKzS05TB1WnU3uIGMZxMGWiZ4Eh7YrWW3cWPhu+/tIXQ5iKDFtAa9Qrflp97xNtAvmsdMuXT/9zj9nAU6FAMQoWmM5YhQCxvrfvNvG3OYeX5Wuzx/1Sf2p2LrAkEagcZHbaLob2zL+3QG3cecbRqqwNr2uRqCJHrL+nfyk3kt7GPFjOqssU9CtTBYBwdV4Mp8d6medbfwLoSbmytdG479POXuLqGgwa5AJuy8GEqNr49cQVSmCXdlRBf8AUTYaecWV8m3Hj4T/AI3PRvGNiMLSqPo5DKx/cVYrm87Xk2mgTXfEwmHWjTp0l+WmgUd9t58SdfOCxVXvnTPTz8tW3TLdMsV1rUxYjJUUb9Nb6zUbOphaagcFEwu3MQM65ja9dBcmw4zXUtsYZFGasu79JzfSKTtWXWMiTi0zEX3DcO/nKvbFc006un/q1dP7RxMTE9KcKNzM3gh19bSofpNhs5dg9zp8q6Dl800krLbJdJ8PkpheTrfzBvPQPhPgerwRqnfiKzsP7U7A9wx8559tjGLibpS1qPUUKpFiSz2A9xPbNm4FcPRo0F3UqSU/GwsT5m585V9FsZoJoR4J4iMMSdOgAUMMJHUwymBDqZmele06tKqi02sOqBtlU6ljzHcJpFMouley6dQJUNw+cIWVmW62awPDfDcndOY3K6ikp9JsSOKn+5B9odOmLj56Sn+1iv1vBrsOkRozj/IH6iQ8bsG3y1b9zJ9wZH3cGv2OT4q0PS+g3zK6eQYe2vtLbYm0ErqzUzdQ5W+7XKDu855xiNm1N2niGImn+HgtSqng1drf4qqn3Uw8sb6O8eeM7jYMYGtUsCfSPqSBim3CRllqHhjulQA6Hjvgq1PMMqsVKkEEctLjwI0haPHuF5Cq4ntA8OP5nNa7JB8OgQcSxtmJJNyI7EuF14SrxG26a5l1JGoIGkqMbtVqikbgPE2Bi8p6i5hfdSOkOOQpYEX4GZCljWoVEqUjZ0YOCdRcHdblJOJY2IHvK2rXX5QM7/tX7nhDGtLjNaeqdHuk1PGqdOrqqe1TuSD3q3Hw3yVtCpYEzyXAYmph3DrZaiMTeymx1FteGpHrNhh+lC4lMrjJU42+Vu8cvCdGOfThy4dXr0zfTJ7imb/+oT6NJmFpO6gIrN/aht6nSB6R070S37HSoPJhf2vNZsaoOrU8wIvvXGdLv08y7rPvsbEH/p2/uqIPoTKrH4Gul70wfCoPxPQa9QW0ma2w2hh/kZFPpsFX8N8IK20aWamQKavWPEArbLf/ACIntrmYv4VYULh61a3aqVyt/wClFFh6s02TGdEy25M8ZjlZA2gnhGMCxjQbOiRYBGBhUaR1MIpgEpTIO3z/ACf+RPx95KQyD0gb+T/mn1kZ/rV8f7RX0W0kTHN3zqaFrXJtyBI9bQ4oLyBnF3XpdYs3j2ypUYHUIxHjaXfRtxTw2HRB2+qR3zX7JYA6jiTJJpJxVbD+kQWE3M5Fi7HffcN2+VLcSz1ktGqltT5DhAE3JhOsUAageJtI/WC5hbtMmnPhM+jMQN+hsJnsXTZXPVuCBvVvyPxNC1BWBuxAseOh0mYqYI5jkqgDd2lJufUTOt8Kr9pID/qIQf3L2h7a+03fQ7Zv8PhspYOKjmqLEOuVlWwvuO6/nMjh8H1zU6fWqCxIJysctgTuv3Tc4JFpU6dJTpTQKDzsN834cflz/VZ9TF5r0gwldMZUwuUdU5D0ag0OVzZV8b6eXrQbaxdCjmpYezsHK1GJI145ACNOFzqZ7Pj8FSrqBUFyPlYEhl1voRPO9vdCaVI9ahNQXJKn9N+W8kecr7cmW76ROa5SYy9s1gCxS7Ai+oHpf3kgaaiHYgaWtGNM7d3bok1NJuDx7DQy0pYw85nFe0KmMtHrYaJscw/V76SBtDHZ1POVdXHyBVxdzCYlcnsXw1FsAh/dVrH/AL7faaVzKXoThzSwGFU7zT6w/wDIxf6MJcMZ1x5md3lTGMExjnMA7RpLedB5p0YR1MKpkZTCqYBJRpWdJ3tSU8BUW/oRJ6tGYzDirTemdzKR4HgfW0nKblisL45SsxSxYhhixMua7KSDvBsRyIj/AOOInH416e5WjfFiVuK2t1dMAb+LBaioCdSLtpe++xIlLX2gTIjKWuTpcEE91tYeGxuRKr7Sd7AMWPjoJodkUrKVeqVqk6AgZPDn5yi2MlENci53g3svko04S8dL9/fLxwjLPkvpPGy67aGqoXmGY+1pMTYtBQM93PElmUeQEqsPjXTS9xJo2jffLnHj/GWXLnfkSjhKFNi1NbMf1Elm9TJtA3Mr+vU7o7+JKgkamXJJ6ZW2+1lisQFEp8TiLgyBXxNVjdgQJHqVzCnJpUbSoK/aVcrHeAND32lLVBU6zWJUU75E2yKTUzp2huYb/wD7Ejwb48jMO8j1HjmPCCYXi018jS0kbMwhr1aVFd9WolMf5MBf7yLaeg/C/o3UNVcbVXLSRW6jNvqOQVzAftALa8926XIyzy1NvUsoUBV0VQAByA0AgnMc7QLtNXCa7QLGK7QLNAi5p0FmnRgENFFUCV/8an7vZvxHLi6f7vZvxA1itbukmk15VDGJ+72b8Rn/AIgpU2Avc/2t+IBV9Jej1RmetQGfNdmp7nB4lefO2/xmILEk30sdQdLeN909aXHU/wB3s34lV0sqU6mFrAEZjkIOU3JFReNpneOVvjzWTVeedcii/wA/LLqPWBxNR6qNbsjiBvI75cbI2ZT60I5BXIbaHeLTTLsnDZSNB/ifxI8Gn3mI2eTlHMS9wuJO4yTh9l0qbFSw5g2P4k1MLS4H2P4jkpZZyoqgtCGnlG+WFOjTH6x/7W/E6pTpHe//AGtHqo2q+tIhkxpHCS2SiOPsfxIWNxFGmBxJ7mh2NwrV3cgbhAVsKTukZ9prz9AZEq7YUcT7w0NrBcDzYCUe1R2mVTcC2vDvja22L7j9ZG/i78faMfKOaEj9UTulmDcG51I5Q+Hw6Aan2Mej8lNRwxJ1BnsnQdj/AANAHgaoHh1rTy7E10Gg+hnp/RzEU6eEw6lteqVjo29u1y745NM88rku3f2lPidqNc5VFhzuYHbm3koUwwN8zBdzePKU+H2vTq8beR/EqRlVuNqNxUHwJEImORuOU8m095VHEp+72b8QT4lOfsfxGXa/zRJnhjF4OR4Zp0eht//Z" alt="미션 이미지" />
              </div>
              <div className='jm-goal-mission-comment-container'>
                <p>시작 몸무게와 현재 몸무게 사진을 올려주세요 (2장)</p>
              </div>
            </div>
            <div className='jm-group-mission-container'>
            <div className="jm-group-tatle-box">
              <div className="jm-goal-name">
                <h2>그룹 챌린지</h2>
                <span>인증 가능 시간 27일 남음</span>
              </div>
              <br/>
              <br/>
              <span>전원 500m 걷기 25회 달성</span>
            </div>
            <div className="jm_challenge_statistics_line-chart">
              <Line
                data={overallLineChartData}
                options={lineChartOptions}
              />
            </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="jm-modal-overlay">
          <div className="jm-modal-content">
            <button className="jm-close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <span>미션 제출</span>

            {/* 파일 업로드 및 미리보기 */}
            <div className="jm-file-upload-container">
              {fileInputs.map((_, index) => (
                <div key={index} className="jm-file-upload">
                  <div className='jm-file-upload-name'>
                  <input
                    type="file"
                    onChange={(event) => handleFileChange(event, index)}
                  />
                  {index > 0 && (
                    <button className='jm-file-delete-btn' onClick={() => handleRemoveFileInput(index)}>
                      &times;
                    </button>
                  )}
                  </div>
                  {previews[index] && (
                    <div className="jm-image-preview">
                      <img src={previews[index]} alt={`Preview ${index}`} />
                    </div>
                  )}
                </div>
              ))}
              </div>
              <button className="jm-add-file-button" onClick={handleAddFileInput}>
                +
              </button>
            
            <div className='jm-modal-add-ok'>
              <p>미션을 제출하시겠습니까?</p>
              <button onClick={handleCloseModal}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
    <ChatRoom/>
    </>
  );
};

export default Mission;
