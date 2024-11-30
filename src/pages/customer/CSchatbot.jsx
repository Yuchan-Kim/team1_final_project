import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Chatbot.css';
import WarningRoundIcon from '@rsuite/icons/WarningRound';

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

const CSchatbot = ({ closeModal }) => {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));
    const [messageHistory, setMessageHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [responseText, setResponseText] = useState('');
    const [promptTxt, setPromptTxt] = useState('');
    const [assistant, setassistant] = useState('');
    const [recentChats, setRecentChats] = useState([]);

    const getPrompt = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getPrompt`);
            const faqData = response.data.apiData;

            if (Array.isArray(faqData)) {
                setPromptTxt(formatPrompt(faqData));
            } else {
                console.error('FAQ 데이터가 배열이 아닙니다:', faqData);
            }

        } catch (error) {
            console.error('faq를 가져오는데 실패했습니다 :', error);
        }
    };

    const getRecentChats = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/getRecentChats`, {
                params: { userNum: authUser.userNum },
            });

            if (response.data.apiData) {
                setRecentChats(response.data.apiData.reverse());
            }
        } catch (error) {
            console.error('최근 채팅을 가져오는 데 실패했습니다:', error);
        }
    };




    const formatPrompt = (data) => {
        let formattedPrompt = `
#persona
당신은 매우 친절하고 전문적인 상담사입니다.
항상 고객에게 친절하고 따뜻하게 응답하며, 고객의 문제를 신속하게 해결하려고 최선을 다합니다.
고객을 최우선으로 생각하고, 고객이 만족할 수 있도록 돕는 것을 가장 중요하게 여깁니다.

#tone
답변은 항상 공손하고 친절하며, 친근하게 고객을 대하며 정확한 정보를 제공해야 합니다.
고객이 이해하기 쉽도록 간단하고 명확한 언어를 사용합니다.

#context
- 당신은 고객의 질문에 최선을 다해 친절하게 대답합니다.
- 고객의 질문에 대해 가능한 한 정확하고 명확한 답변을 제공합니다.
- 질문에 대한 답변은 아래의  #동키동키정보 에 있는 내용으로만 작성합니다.
- 답변이 길어질 경우, 요약해서 제공하고, url정보가 있는경우 링크정보도 제공합니다.
- 응답은 고객이 바로 이해할 수 있도록 간결하고 명확하게 작성합니다.
- 답변은 최대 100글자로 요약해서 작성합니다.
- 질문에 대한 적절한 답변이 없다면, 고객에게 사과하고 고객센터로 문의를 유도하는 아래의 메세지를 출력합니다.
----
죄송합니다.
고객센터로 문의 바랍니다.
070-1004-8282
----

#동키동키정보
----
`;

        data.forEach((faq) => {
            formattedPrompt += `Q: ${faq.faqTitle}\n\nA: ${faq.faqContent}\n----\n`;
        });

        return formattedPrompt;
    };

    const LineBreaks = (text) => {
        return text.split('\n').map((item, index) => {
            return <span key={index}>{item}<br /></span>;
        });
    };

    useEffect(() => {
        if (authUser === null) {
            alert('로그인이 필요한 서비스입니다');
            navigate('/user/loginform');
        } else {
            getPrompt();
            getRecentChats();
        }
    }, [authUser, navigate]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messageHistory, recentChats]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userInput.trim()) {
            return;
        }

        const newMessageHistory = [
            ...(messageHistory.length === 0 ? [{ role: 'system', content: promptTxt }] : []),
            ...messageHistory,
            { role: 'user', content: userInput },

        ];

        try {
            const assistantResponse = await callOpenAI(newMessageHistory);
            newMessageHistory.push({ role: 'assistant', content: assistantResponse });

            setMessageHistory(newMessageHistory);
            setResponseText(assistantResponse);
            setassistant(assistantResponse);
            setUserInput('');

            await axios.post(`${process.env.REACT_APP_API_URL}/api/saveChat`, {
                userNum: authUser.userNum,
                csbotAnswer: userInput,
                csbotWriter: 1,
            });

            await axios.post(`${process.env.REACT_APP_API_URL}/api/saveChat`, {
                userNum: authUser.userNum,
                csbotAnswer: assistantResponse,
                csbotWriter: 2,
            });

        } catch (error) {
            console.error('Error during OpenAI API call:', error);
            setResponseText('챗봇 응답 중 문제가 발생했습니다. 나중에 다시 시도해주세요.');
        }

        try {
            const formData = new FormData();

            formData.append('userNum', authUser.userNum);
            formData.append('csbotWriter', userInput);
            formData.append('csbotAnswer', assistant);

        } catch (error) {
            console.error('newMessageHistory를 등록하는데 실패했습니다 :', error);
        }

    };

    return (
        <div className='jy-chatbot'>
            <div className="jy-chatbot-container">
                <div className="jy-chatbot-header">
                    <h2>Donkey ChatBot</h2>
                    <div className='jy-chatbot-close-button' onClick={closeModal}><WarningRoundIcon /></div>
                </div>

                <div className="jy-chatbot-messages">
                    <div className="jy-chatbot-message jy-chatbot-first">
                        <strong>동키 챗봇:</strong><br />
                        안녕하세요! 동기 키우기의 동키입니다.<br />
                        궁금한 점이 있다면 물어보세요~<br /><br />
                        고객센터<br />
                        개인 정보 수정<br />
                        챌린지 정보<br />
                        포인트<br />
                        랭킹<br /><br />
                        안내가 가능합니다.
                    </div>

                    {recentChats.length > 0 && recentChats.map((chat, index) => (
                        <div key={index} className={`jy-chatbot-message ${chat.csbotWriter === 1 ? 'user' : 'assistant'}`}>
                            <strong>{chat.csbotWriter === 1 ? authUser.userName : '동키 챗봇'}:</strong>
                            <p>{LineBreaks(chat.csbotAnswer)}</p>
                        </div>
                    ))}
                    {messageHistory.slice(1).map((msg, index) => (
                        <div key={index} className={`jy-chatbot-message ${msg.role}`}>
                            <strong>{msg.role === 'user' ? authUser.userName : '동키 챗봇'}:</strong>
                            <p>{LineBreaks(msg.content)}</p>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
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
    );
};

export default CSchatbot;
