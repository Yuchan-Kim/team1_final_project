//import 라이브러리

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

//import 컴포넌트
import Header from '../../pages/include/DH_Header';
import Footert from "../../pages/include/JM-Footer.jsx";
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import WechatCustomerOutlineIcon from '@rsuite/icons/WechatCustomerOutline';

//import css
import '../../css/reset.css';
import '../../css/customerservice.css';


const CustomerService = () => {

    /*---라우터 관련-------------------------------*/

    /*---상태관리 변수들(값이 변화면 화면 랜더링 )---*/

    /*---일반 변수--------------------------------*/
    // 각 질문에 대한 답변을 표시하는 상태를 관리하기 위한 배열
    const [openIndex, setOpenIndex] = useState(null);
    const [faqs, setFaqs] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    /*---일반 메소드 -----------------------------*/

    /*---훅(useEffect)+이벤트(handle)메소드-------*/
    useEffect(()=>{
        console.log("마운트 됐어요");

        // 서버로 데이터 전송
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/faq`,

            responseType: 'json' //수신타입 받을때
        }).then(response => {
            console.log(response); //수신데이타
            setFaqs(response.data.apiData);

        }).catch(error => {
            console.log(error);
        });

    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 질문 클릭 시 답변을 토글하는 함수
    const toggleAnswer = (index) => {
        if (openIndex === index) {
            setOpenIndex(null); // 이미 열려있는 답변을 닫음
        } else {
            setOpenIndex(index); // 선택한 질문에 대한 답변을 열음
        }
    };

    // 줄바꿈을 <br />로 변환하는 함수
    const LineBreaks = (text) => {
        return text.split('\n').map((item, index) => {
            return <span key={index}>{item}<br /></span>;
        });
    };


    return (

        <>
            <Header />
            {/* // header */}

            <div className="dy-wrap">
                <div className="dy-customerservice">
                    <div className="dy-customerservice-header">
                        <h1 className="dy-customerserviceTitle">고객 센터</h1>
                        <img src="../images/customerservice.jpg" className="dy-faq-img" alt="자주 묻는 질문 이미지"/>
                    </div>
                    {/* /dy-customerservice-header */}

                    <div className="dy-customerservice-content">
                        <div className="customerservice-faq-list">
                            {faqs.map((faq, index) => (
                                <div key={index} className="faq-item">
                                    <div className="faq-question" onClick={() => toggleAnswer(index)}>
                                        <h3>Q. {LineBreaks(faq.faqTitle)}</h3>
                                        <div className="faq-arrow">
                                            {openIndex === index ? <ArrowUpLineIcon /> : <ArrowDownLineIcon />}
                                        </div>
                                    </div>
                                    {/* 답변이 열려있을 때만 보이게 */}
                                    {openIndex === index && (
                                        <div className="faq-answer">
                                            <p>A. {LineBreaks(faq.faqContent)}</p>
                                        </div>
                                    )}
                                </div>
                                // faq-item
                            ))}
                        </div>
                        {/* /customerservice-faq-list */}

                    </div>
                    {/* /dy-customerservice-content */}

                    {/* 모달 열기 버튼 복구 */}
                    <div className="dy-customerservice-btn">
                        <button className="customerservice-btn" onClick={openModal}>
                            <span>
                                <WechatCustomerOutlineIcon /><br />챗봇
                            </span>
                        </button>
                    </div>
                    {/* /dy-customerservice-modal */}
                    
                    {/* 모달 구현 */}
                    <Modal isOpen={isModalOpen} className="" >
                        <div className="">
                            <button onClick={closeModal} className="">닫기</button>
                        </div>
                    </Modal>

                </div>
                {/* /dy-customerservice */}
            </div>
            {/* /wrap */}

            {/* 푸터 */}
            <Footert/>
            {/* 푸터 끝 */}
        </>

    );

}

export default CustomerService;