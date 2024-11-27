

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './Chatbot.css';


const callOpenAI = async (messageHistory) => {

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo-0125',
                messages: messageHistory,
                temperature: 1,
                max_tokens: 2048,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw error;
    }
};



const Chatbot = ({ closeModal }) => {

    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));

    const [messageHistory, setMessageHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [responseText, setResponseText] = useState('');

    const navigate = useNavigate();

    const prompt_txt = `
    #persona
        당신의 쇼핑몰의 상담사 입니다.
        항상 고객을 공손하게 맞이하며 고객을 최우선우선으로 생각합니다.

        #tone
        항상 최선을 다해 공손한 말투를 사용합니다.

        #context
        - 당신은 고객의 질문에 최선을 다해 친절하게 대답합니다.
        - 질문에 대한 답변은 아래의  #동키동키정보 에 있는 내용으로만 작성합니다.
        - 해당하는 내용을 요약해서 대답하고 url정보가 있는경우 링크정보도 제공합니다.
        - 답변은 최대 50글자로 요약해서 작성합니다.
        - 질문에 대답만 짧고 간결하게하고 다른 인사말은 하지 않습니다.
        - 질문에 대한 적절한 답변이 없다면 아래의 메세지를 출력합니다.
        ----
        죄송합니다.
        고객센터로 문의 바랍니다.
        070-1004-8282
        ----

        #동키동키정보

        ----
        Q: 안녕하세요

        A:
        안녕하세요! 동키키우기의 동키입니다!
        무엇을 도와드릴까요?
        ----
        Q: 고객센터 운영시간?

        A:
        고객센터 운영시간은 월요일부터 금요일까지이며, 
        오전 10시부터 오후 5시까지입니다. 
        점심시간은 오후 1시부터 2시까지입니다.
        ---
        Q: 비밀번호를 변경하려면 어떻게 해야 하나요?

        A:
        비밀번호 변경은 사용중인 계정에 따라 아래 안내를 확인해 주세요.

        1. 동키웹사이트 상단 우측의 프로필 사진을 클릭하여 [마이페이지 > 프로필 사진 > 비밀번호 변경]에서 변경 하실 수 있습니다.
        URL : http://13.125.216.39:9000/my/mypage

        2. 카카오 계정 비밀번호 변경
        [카카오 계정 사이트(https://accounts.kakao.com) > 로그인 > 계정 관리 > 계정 보안 > 비밀번호 변경] 에서 비밀번호를 변경
        또는
        3. 카카오 계정 비밀번호를 잊어버린 경우
        [카카오계정 사이트(https://accounts.kakao.com) > 로그인> 카카오계정 비밀번호 찾기> 비밀번호 재설정
        4. 네이버 계정 비밀번호 변경
        네이버 계정 사이트(https://accounts.naver.com) > 로그인 > 계정 관리 > 계정 보안 > 비밀번호 변경] 에서 비밀번호를 변경
        또는
        5. 네이버 계정 비밀번호를 잊어버린 경우
        네이버 계정 사이트(https://accounts.naver.com) > 로그인> 네이버 계정 비밀번호 찾기> 비밀번호 재설정
        6. 구글 계정 비밀번호 변경
        [구글 계정 사이트(https://accounts.google.com) > 로그인 > 계정 관리 > 계정 보안 > 비밀번호 변경] 에서 비밀번호를 변경
        또는
        7. 구글 계정 비밀번호를 잊어버린 경우
        [구글 계정 사이트(https://accounts.google.com) > 로그인> 구글 계정 비밀번호 찾기> 비밀번호 재설정

        비밀번호를 변경하면 해당 변경한 계정으로 로그인되어있던 기기는 자동으로 로그아웃되며,
        로그아웃이 적용되는데 일정 시간이 소요될 수 있습니다.
        ----
        Q: 포인트 상점의 상품을 환불 받고 싶어요

        A:
        저희 동기 키우기의 포인트 상점을 이용해 주셔서 감사합니다. 
        포인트 상점의 상품은 동기키우기의 내부 정책 상 환불이 불가합니다.
        ----
        Q: 포인트를 얻으려면 구매해야 하나요?

        A:
        동기키우기에서는 포인트의 구매가 이루어 지고 있지 않습니다.
        다만, 포인트 상점의 로그인 출석과 챌린지를 통해 포인트를 확득 하실 수 있습니다!
        많은 참여 바랍니다!
        ----
        Q: 탈퇴하고 싶어요

        A:
        안타깝지만 저희 동기키우기에서 탈퇴는 내부 정책 상 성립이 되지 않습니다..
        도전하는 당신을 응원합니다!
        ----
        Q: 포인트는 어디에서 사용하나요?

        A:
        상단에 위치한 상점 클릭하여 
        [포인트 상점으로 이동 > 꾸미기 아이템 또는 기프티콘 선택]하여  교환 하실 수 있습니다.
        ----
        Q: 포인트 상점에서 출석하기가 무엇인가요?

        A:
        하루에 한번 출석체크가 가능하고, 50 P 획득 하실 수 있습니다.
        ----
        Q: 챌린지 달성율에 따라 포인트가 어떻게 달라지나요?

        A:
        포인트는 달성율에 따라 달라집니다.
        1. 달성율 100%의 경우 배팅포인트의 120% 지급
        2. 달성율 85% 이상의 경우 배팅포인트의 100% 지급
        3. 달성율 85% 미만의 경우 배팅포인트 % 삭감
        ----
        Q: 랭킹의 기준은 무엇인가요?

        A:
        동키는 출석과 챌린지를 통해 포인트를 확득하므로 누적 포인트로 랭킹이 정해집니다.
        ----
        Q: 프로필 사진은 어떻게 바꾸나요?

        A: 출석과 챌린지를 통해 포인트 확득 후 포인트 상점에서 원하는 프로필을 구매하실 수 있습니다.     
        ----
        Q: 포인트 상점에서 구매한 상품들은 어디서 확인할 수 있나요?

        A:
        포인트 상점에서 구매할수 있는 상품은 두가지입니다.
        1. 꾸미기 아이템
        상단 우측의 프로필 사진을 클릭하여 [마이페이지로 이동 > 프로필 사진 선택] 후 구매한 프로필을 확인 하실 수 있습니다.
        2. 기프티콘
        상단 우측의 프로필 사진을 클릭하여 [마이페이지로 이동 > 보관함 이동] 후 구매한 기프티콘을 확인 하실 수 있습니다.
        ----
    `;


    useEffect(() => {

        if (authUser === null) {
            alert('로그인이 필요한 서비스입니다');
            navigate('/user/loginform');
        } else {
        }


    }, [authUser, navigate]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        const newMessageHistory = [
            ...(messageHistory.length === 0 ? [{ role: 'system', content: prompt_txt }] : []),
            ...messageHistory,
            { role: 'user', content: userInput },
        ];

        try {

            const assistantResponse = await callOpenAI(newMessageHistory)
            newMessageHistory.push({ role: 'assistant', content: assistantResponse });

            setMessageHistory(newMessageHistory);
            setResponseText(assistantResponse);
            setUserInput('');

        } catch (error) {
            console.error('Error during OpenAI API call:', error);
            setResponseText('챗봇 응답 중 문제가 발생했습니다. 나중에 다시 시도해주세요.');
        }

    };


    return (

        <>
            <div className='jy-chatbot'>
                <div className="jy-chatbot-container">
                    <div className="jy-chatbot-header">
                        <h2>Donkey CSchatBot</h2>
                        <div className='jy-chatbot-close-button' onClick={closeModal}>X</div>
                    </div>

                    <div className="jy-chatbot-messages">

                        {messageHistory.slice(1).map((msg, index) => (
                            <div key={index} className={`jy-chatbot-message ${msg.role}`}>
                                <strong>{msg.role === 'user' ? authUser.userName : '동키 챗봇'}:</strong>
                                <p>{msg.content}</p>
                            </div>
                        ))}

                    </div>

                    <div className="jy-chatbot-input">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="질문을 입력하세요"
                            />
                            <button type="submit">전송</button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Chatbot;
