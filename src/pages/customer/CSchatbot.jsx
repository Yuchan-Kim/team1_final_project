import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const CSchatbot = ({ closeModal }) => {
    const navigate = useNavigate();

    const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));
    const [messageHistory, setMessageHistory] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [responseText, setResponseText] = useState('');
    const [promptTxt, setPromptTxt] = useState('');

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

    const formatPrompt = (data) => {
        let formattedPrompt = `
#persona
당신의 쇼핑몰의 상담사 입니다.
항상 고객을 공손하게 맞이하며 고객을 최우선으로 생각합니다.

#tone
항상 최선을 다해 공손한 말투를 사용합니다.

#context
- 당신은 고객의 질문에 최선을 다해 친절하게 대답합니다.
- 질문에 대한 답변은 아래의  #동키동키정보 에 있는 내용으로만 작성합니다.
- 해당하는 내용을 요약해서 대답하고 url정보가 있는경우 링크정보도 제공합니다.
- 답변은 최대 100글자로 요약해서 작성합니다.
- 질문에 대한 적절한 답변이 없다면 아래의 메세지를 출력합니다.
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
        }
    }, [authUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            setUserInput('');
        } catch (error) {
            console.error('Error during OpenAI API call:', error);
            setResponseText('챗봇 응답 중 문제가 발생했습니다. 나중에 다시 시도해주세요.');
        }
    };

    return (
        <div className='jy-chatbot'>
            <div className="jy-chatbot-container">
                <div className="jy-chatbot-header">
                    <h2>Donkey ChatBot</h2>
                    <div className='jy-chatbot-close-button' onClick={closeModal}>X</div>
                </div>

                <div className="jy-chatbot-messages">
                    {messageHistory.slice(1).map((msg, index) => (
                        <div key={index} className={`jy-chatbot-message ${msg.role}`}>
                            <strong>{msg.role === 'user' ? authUser.userName : '동키 챗봇'}:</strong>
                            <p>{LineBreaks(msg.content)}</p>
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
    );
};

export default CSchatbot;
