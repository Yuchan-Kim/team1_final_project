// src/ham_pages/ham_common/profileStore.jsx

class ProfileStore {
    constructor() {
        this.profileImage = require('../../ham_asset/images/profile-fill.png'); // 기본 프로필 이미지
        this.nickname = "씽씽이김유찬"; // 기본 닉네임
        this.subscribers = [];
    }

    // 현재 프로필 이미지 반환
    getProfileImage() {
        return this.profileImage;
    }

    // 프로필 이미지 업데이트 및 구독자에게 알림
    setProfileImage(newImage) {
        this.profileImage = newImage;
        this.notifySubscribers();
    }

    // 현재 닉네임 반환
    getNickname() {
        return this.nickname;
    }

    // 닉네임 업데이트 및 구독자에게 알림
    setNickname(newNickname) {
        this.nickname = newNickname;
        this.notifySubscribers();
    }

    // 구독자 추가
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    // 구독자 제거
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    // 구독자에게 변경 사항 알림
    notifySubscribers() {
        this.subscribers.forEach(callback => callback({
            profileImage: this.profileImage,
            nickname: this.nickname
        }));
    }
}

// 싱글톤 인스턴스 생성 및 내보내기
const profileStore = new ProfileStore();
export default profileStore;
