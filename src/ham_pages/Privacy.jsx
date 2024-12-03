// src/pages/Privacy.jsx
import React from 'react';
import '../ham_asset/css/privacy.css'; // CSS 파일 임포트

const Privacy = () => {
    return (
        <div className="privacy-container">
            <h1 className="privacy-title">개인정보처리방침</h1>
            
            <section className="privacy-section">
                <h2 className="privacy-section-title">제1조 (목적)</h2>
                <p className="privacy-text">
                    본 개인정보처리방침은 Donkey: 동기 키우기(이하 "서비스"라 한다)를 이용하는 이용자들의 개인정보를 보호하고, 관련 법령을 준수하기 위해 마련되었습니다. 
                    운영자는 이용자의 개인정보를 중요시하며, 이용자의 개인정보를 안전하게 관리하기 위해 최선을 다하고 있습니다.
                </p>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제2조 (수집하는 개인정보 항목)</h2>
                <p className="privacy-text">
                    서비스는 다음과 같은 개인정보를 수집합니다.
                </p>
                <ul className="privacy-list">
                    <li><strong>필수항목:</strong> 이메일, 닉네임</li>
                    <li><strong>선택항목:</strong> 프로필 사진, 연락처</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제3조 (개인정보의 수집 방법)</h2>
                <p className="privacy-text">
                    운영자는 다음과 같은 방법으로 개인정보를 수집합니다.
                </p>
                <ul className="privacy-list">
                    <li>서비스 이용 시 회원가입을 통해 직접 입력</li>
                    <li>미션 인증 과정에서 사진 업로드</li>
                    <li>자동으로 생성되는 로그 데이터</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제4조 (개인정보의 수집 및 이용 목적)</h2>
                <p className="privacy-text">
                    운영자는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
                </p>
                <ul className="privacy-list">
                    <li>회원 식별 및 서비스 제공</li>
                    <li>사용자 맞춤형 서비스 제공</li>
                    <li>서비스 개선 및 신규 서비스 개발</li>
                    <li>고객 지원 및 문의 대응</li>
                    <li>마케팅 및 광고에 활용</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제5조 (개인정보의 보유 및 이용 기간)</h2>
                <p className="privacy-text">
                    운영자는 개인정보의 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 
                    단, 다음의 경우에는 예외적으로 보유할 수 있습니다.
                </p>
                <ul className="privacy-list">
                    <li>
                        <strong>관련 법령에 의하여 보존할 필요가 있는 경우:</strong>
                        <ul>
                            <li>전자상거래 등에서의 소비자 보호에 관한 법률: 계약 또는 청약철회 등에 관한 기록 (5년)</li>
                            <li>통신비밀보호법: 서비스 이용 기록 (3개월)</li>
                        </ul>
                    </li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제6조 (개인정보의 파기 절차 및 방법)</h2>
                <p className="privacy-text">
                    운영자는 개인정보의 수집 및 이용 목적이 달성된 후, 다음과 같은 절차에 따라 개인정보를 파기합니다.
                </p>
                <ul className="privacy-list">
                    <li>
                        <strong>파기 절차:</strong> 운영자는 파기 사유가 발생한 개인정보를 선정하고, 운영자의 개인정보 파기 책임자의 승인 후, 즉시 파기합니다.
                    </li>
                    <li>
                        <strong>파기 방법:</strong> 전자적 파일 형태의 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제하며, 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
                    </li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제7조 (개인정보의 제3자 제공)</h2>
                <p className="privacy-text">
                    운영자는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외적으로 개인정보를 제공할 수 있습니다.
                </p>
                <ul className="privacy-list">
                    <li>
                        이용자가 사전에 동의한 경우
                    </li>
                    <li>
                        법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
                    </li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제8조 (개인정보의 안전성 확보 조치)</h2>
                <p className="privacy-text">
                    운영자는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
                </p>
                <ul className="privacy-list">
                    <li>개인정보에 대한 접근 권한의 제한</li>
                    <li>개인정보의 암호화</li>
                    <li>해킹 등에 대비한 방화벽 설치</li>
                    <li>정기적인 보안 점검 및 업데이트</li>
                </ul>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제9조 (개인정보 처리방침의 변경)</h2>
                <p className="privacy-text">
                    운영자는 관련 법령을 준수하면서 본 개인정보처리방침을 개정할 수 있습니다. 
                    개인정보처리방침을 개정하는 경우에는 개정된 내용을 지체 없이 공지하며, 
                    중요한 내용이 변경되는 경우에는 별도의 공지 절차를 거칩니다.
                </p>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제10조 (이용자의 권리와 그 행사 방법)</h2>
                <p className="privacy-text">
                    이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 개인정보의 삭제를 요청할 수 있습니다. 
                    이러한 권리 행사는 서비스 내 '마이페이지' 또는 고객센터를 통해 가능합니다.
                </p>
            </section>

            <section className="privacy-section">
                <h2 className="privacy-section-title">제11조 (연락처)</h2>
                <p className="privacy-text">
                    개인정보 관련 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
                </p>
                <ul className="privacy-list">
                    <li><strong>이메일:</strong> privacy@donkey.com</li>
                    <li><strong>전화번호:</strong> 1234-5678</li>
                    <li><strong>주소:</strong> 서울특별시 강남구 테헤란로 123, Donkey 빌딩</li>
                </ul>
            </section>

            <footer className="privacy-footer">
                <p>본 개인정보처리방침은 Donkey: 동기 키우기 서비스의 운영과 관련하여 필수적인 사항을 규정하고 있으며, 
                이용자 여러분의 개인정보 보호를 위해 꼭 숙지해 주시기 바랍니다.</p>
                <p>감사합니다.</p>
            </footer>
        </div>
    );
};

export default Privacy;
