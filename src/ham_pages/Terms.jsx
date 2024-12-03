// src/pages/Terms.jsx
import React from 'react';
import '../ham_asset/css/terms.css'; // CSS 파일 임포트

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
            <section className="terms-section">
                <h2 className="terms-section-title">제5조 (회원가입)</h2>
                <ul className="terms-list">
                    <li><strong>"회원가입"</strong>은 서비스가 정한 양식에 따라 회원정보를 기입하고, 운영자가 이를 승인함으로써 성립됩니다.</li>
                    <li><strong>"회원"</strong>은 회원가입 시 제공하는 정보가 정확하고 최신의 정보임을 보장해야 하며, 정보에 변경이 있는 경우 즉시 수정해야 합니다.</li>
                    <li><strong>"운영자"</strong>는 다음 각 호에 해당하는 회원가입 신청에 대하여는 이를 승인하지 않을 수 있습니다.</li>
                    <li><strong>ㆍ</strong>타인의 명의를 도용하여 신청한 경우</li>
                    <li><strong>ㆍ</strong>허위의 정보를 기재하여 신청한 경우</li>
                    <li><strong>ㆍ</strong>기타 회원으로서 부적절하다고 판단되는 경우</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제6조 (회원의 의무)</h2>
                <ul className="terms-list">
                    <li>회원은 서비스 이용 시 다음 각 호의 행위를 하여서는 안 됩니다.</li>
                    <li><strong>ㆍ</strong>신청 또는 변경 시 허위 내용의 등록</li>
                    <li><strong>ㆍ</strong>타인의 정보 도용</li>
                    <li><strong>ㆍ</strong>서비스에 게시된 정보의 변경</li>
                    <li><strong>ㆍ</strong>서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
                    <li><strong>ㆍ</strong>운영자를 비방하거나 명예를 손상시키는 행위</li>
                    <li><strong>ㆍ</strong>기타 불법적이거나 부당한 행위</li>
                    <li>회원은 서비스 이용을 통해 취득한 정보를 운영자의 사전 승낙 없이 복제, 전송, 출판, 배포, 방송 기타 방법으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
                    <li>회원은 관계법령, 본 약관의 규정을 준수하여야 하며, 기타 운영자의 업무에 방해되는 행위를 하여서는 안 됩니다.</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제7조 (서비스의 제공 및 변경)</h2>
                <ul className="terms-list">
                    <li>운영자는 회원에게 다음과 같은 서비스를 제공합니다.</li>
                    <li><strong>ㆍ</strong>다양한 카테고리(운동, 독서, 공부, 식습관 개선, 취미 등)의 챌린지 방 참여</li>
                    <li><strong>ㆍ</strong>미션 수행 및 인증</li>
                    <li><strong>ㆍ</strong>포인트 적립 및 포인트 상점 이용</li>
                    <li><strong>ㆍ</strong>사용자 통계 및 랭킹 확인</li>
                    <li><strong>ㆍ</strong>기타 운영자가 정하는 서비스</li>
                    <li>운영자는 서비스의 내용, 제공 방법 등을 변경할 수 있으며, 변경 시 사전 공지합니다.</li>
                    <li>운영자는 긴급한 사유가 있는 경우 사전 공지 없이 서비스의 전부 또는 일부를 중단할 수 있습니다. 이 경우 운영자는 가능한 한 신속하게 이를 공지합니다.</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제8조 (서비스의 중단)</h2>
                <ul className="terms-list">
                    <li>운영자는 다음 각 호에 해당하는 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다.</li>
                    <li><strong>ㆍ</strong>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
                    <li><strong>ㆍ</strong>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
                    <li><strong>ㆍ</strong>기타 불가항력적 사유가 있는 경우</li>
                    <li>서비스 중단 시 운영자는 사전에 공지하며, 사전에 공지할 수 없는 부득이한 사유가 있는 경우 최소한의 방법으로 이를 알립니다.</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제9조 (회원 탈퇴 및 자격 상실)</h2>
                <ul className="terms-list">
                    <li>회원은 언제든지 서비스 내 탈퇴 메뉴를 통해 탈퇴할 수 있으며, 탈퇴 시 모든 정보는 삭제됩니다.</li>
                    <li>운영자는 회원이 다음 각 호의 사유에 해당하는 경우 사전 통지 없이 회원자격을 제한 또는 정지시킬 수 있습니다.</li>
                    <li><strong>ㆍ</strong>회원가입 시 허위 내용을 등록한 경우</li>
                    <li><strong>ㆍ</strong>서비스 이용 중 다른 회원 또는 제3자를 비방하거나 명예를 손상시키는 경우</li>
                    <li><strong>ㆍ</strong>기타 운영자가 정한 이용 규정을 위반한 경우</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제10조 (포인트의 적립 및 사용)</h2>
                <ul className="terms-list">
                    <li>이용자는 서비스 내에서 활동을 통해 포인트를 적립할 수 있습니다. 포인트의 적립 방법은 운영자가 별도로 정합니다.</li>
                    <li>적립된 포인트는 포인트 상점에서 상품이나 서비스로 교환할 수 있습니다. 교환 가능한 상품 및 서비스는 운영자가 별도로 정합니다.</li>
                    <li>포인트는 현금으로 환급되지 않으며, 타인에게 양도, 판매, 대여할 수 없습니다.</li>
                    <li>운영자는 포인트 제도의 변경, 일시 중지, 종료 시 사전 공지 후 시행할 수 있습니다.</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제11조 (저작권의 귀속 및 이용제한)</h2>
                <ul className="terms-list">
                    <li>서비스에 대한 저작권 및 지적재산권은 운영자 또는 정당한 권리를 가진 제3자에게 귀속됩니다.</li>
                    <li>회원은 서비스 이용을 통해 얻은 정보를 운영자의 사전 승낙 없이 복제, 전송, 출판, 배포, 방송 기타 방법으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
                    <li>회원이 게시한 콘텐츠에 대한 권리는 해당 콘텐츠를 게시한 회원에게 귀속됩니다. 다만, 운영자는 서비스의 운영, 개선을 위하여 이를 사용할 수 있습니다.</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제12조 (개인정보 보호)</h2>
                <ul className="terms-list">
                    <li>운영자는 이용자의 개인정보를 보호하기 위하여 노력하며, 개인정보처리방침을 통해 그 내용을 공개합니다.</li>
                    <li>이용자는 언제든지 자신의 개인정보에 대한 열람, 수정, 삭제를 요청할 수 있으며, 운영자는 이에 대해 지체 없이 조치합니다.</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제13조 (면책조항)</h2>
                <ul className="terms-list">
                    <li>운영자는 천재지변, 불가항력적 사유 등으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                    <li>운영자는 이용자가 서비스 이용 중 게재한 정보, 자료, 사실의 신뢰도 및 정확성 등에 대해서는 책임을 지지 않습니다.</li>
                    <li>운영자는 이용자가 서비스를 통해 기대하는 수익을 상실한 것에 대하여 책임을 지지 않습니다.</li>
                    <li>운영자는 서비스에 연결되어 있는 제3자 웹사이트의 정보에 관해서는 책임을 지지 않습니다.</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제14조 (분쟁 해결)</h2>
                <ul className="terms-list">
                    <li>운영자와 이용자 간에 발생한 분쟁은 관련 법령에 따릅니다.</li>
                    <li>운영자와 이용자 간에 발생한 분쟁에 관한 소송은 운영자의 주된 영업소 소재지를 관할하는 법원을 제1심 법원으로 합니다.</li>
                </ul>
            </section>
            <section className="terms-section">
                <h2 className="terms-section-title">제15조 (약관의 해석 및 준용)</h2>
                <ul className="terms-list">
                    <li>본 약관의 해석 및 적용에 관하여는 대한민국 법령을 준수합니다.</li>
                    <li>본 약관의 조항 중 일부가 무효이거나 집행 불가능할 경우에도, 나머지 조항의 유효성 및 집행 가능성에는 영향을 미치지 않습니다.</li>
                </ul>
            </section>

            <section className="terms-section">
                <h2 className="terms-section-title">부칙</h2>
                <ul className="terms-list">
                    <li>본 약관은 2024년 12월 10일부터 시행됩니다.</li>
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
                    <li><strong>기관명:</strong> 하이미디어아카데미 </li>
                    <li><strong>전화번호:</strong> 02.3478.0008</li>
                    <li><strong>주소:</strong> 서울 서초구 강남대로 405 통영빌딩 8층</li>
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
