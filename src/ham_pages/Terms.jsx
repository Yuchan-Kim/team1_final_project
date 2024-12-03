// src/pages/Terms.jsx
import React from 'react';
import './terms.css'; // CSS 파일 임포트

const Terms = () => {
    return (
        <div className="terms-container">
            <h1 className="terms-title">서비스 이용약관</h1>
            
            <section className="terms-section">
                <h2 className="terms-section-title">제1조 (목적)</h2>
                <p className="terms-text">
                    본 약관은 현재 개발 중인 서비스(Donkey: 동기 키우기)의 이용조건 및 절차를 규정함을 목적으로 합니다.
                </p>
            </section>

            <section className="terms-section">
                <h2 className="terms-section-title">제2조 (약관의 효력 및 변경)</h2>
                <ol className="terms-list">
                    <li>
                        본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.
                    </li>
                    <li>
                        운영자는 관련 법률을 위배하지 않는 범위 내에서 본 약관을 개정할 수 있으며, 개정된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력을 발생합니다.
                    </li>
                </ol>
            </section>

            <section className="terms-section">
                <h2 className="terms-section-title">제3조 (약관 외 준칙)</h2>
                <p className="terms-text">
                    본 약관에 명시되지 않은 사항에 대하여는 관련 법령 또는 서비스의 개별 이용약관 및 운영정책에 따릅니다.
                </p>
            </section>

            <section className="terms-section">
                <h2 className="terms-section-title">제4조 (용어의 정의)</h2>
                <ul className="terms-list">
                    <li><strong>"이용자"</strong>란 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 개인 또는 법인을 말합니다.</li>
                    <li><strong>"운영자"</strong>란 서비스를 기획, 개발, 운영하는 주체를 말합니다.</li>
                    <li><strong>"회원"</strong>이라 함은 서비스에 회원가입을 한 자로서, 운영자가 제공하는 서비스를 지속적으로 이용할 수 있는 자를 말합니다.</li>
                    <li><strong>"비회원"</strong>이라 함은 회원에 가입하지 않고 서비스를 이용하는 자를 말합니다.</li>
                    <li><strong>"포인트"</strong>라 함은 이용자가 서비스 내에서 활동을 통해 적립할 수 있는 가상의 화폐를 말합니다.</li>
                    <li><strong>"포인트 상점"</strong>이라 함은 포인트를 사용하여 상품이나 서비스를 구매할 수 있는 장소를 말합니다.</li>
                </ul>
            </section>

            {/* ... 추가 조항들도 같은 방식으로 작성 ... */}

            <section className="terms-section">
                <h2 className="terms-section-title">부칙</h2>
                <ul className="terms-list">
                    <li>본 약관은 2024년 5월 1일부터 시행됩니다.</li>
                    <li>이전의 약관은 2024년 4월 30일까지 유효합니다.</li>
                </ul>
            </section>

            <section className="terms-section">
                <h2 className="terms-section-title">부록: 서비스 이용 시 준수사항 및 금지행위</h2>
                <h3 className="terms-subsection-title">제1항: 준수사항</h3>
                <ol className="terms-list">
                    <li>타인의 개인정보 및 저작권을 침해하지 않도록 주의합니다.</li>
                    <li>서비스 이용을 이용함에 있어 법령과 본 약관을 준수합니다.</li>
                    <li>타인에게 불쾌감을 주거나 명예를 훼손하는 행위를 하지 않습니다.</li>
                </ol>

                <h3 className="terms-subsection-title">제2항: 금지행위</h3>
                <ol className="terms-list">
                    <li>허위 정보를 제공하거나 사기를 목적으로 서비스를 이용하는 행위</li>
                    <li>서비스의 안정적인 운영을 방해하는 행위</li>
                    <li>바이러스, 악성코드 등을 유포하는 행위</li>
                    <li>기타 운영자가 정한 이용 규정을 위반하는 행위</li>
                </ol>
            </section>

            <section className="terms-section">
                <h2 className="terms-section-title">연락처</h2>
                <p className="terms-text">
                    서비스 이용 중 문의사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
                </p>
                <ul className="terms-list">
                    <li><strong>이메일:</strong> support@donkey.com</li>
                    <li><strong>전화번호:</strong> 1234-5678</li>
                    <li><strong>주소:</strong> 서울특별시 강남구 테헤란로 123, Donkey 빌딩</li>
                </ul>
            </section>

            <footer className="terms-footer">
                <p>본 이용약관은 **Donkey: 동기 키우기** 서비스의 운영과 관련하여 필수적인 사항을 규정하고 있으며, 이용자 여러분의 원활한 서비스 이용을 위해 꼭 숙지해 주시기 바랍니다.</p>
                <p>감사합니다.</p>
            </footer>
        </div>
    );
};

export default Terms;
