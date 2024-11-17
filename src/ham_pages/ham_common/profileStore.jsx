class ProfileStore {
    constructor() {
        // localStorage에서 사용자 정보 불러오기
        this.profileImage = localStorage.getItem('profileImage') || require('../../ham_asset/images/profile-fill.png');
        this.nickname = localStorage.getItem('nickname') || "사용자";
        this.userNum = parseInt(localStorage.getItem('userNum')) || 1;
        this.subscribers = [];

        // 초기 데이터 로드
        this.loadUserData();
    }

    // 서버에서 사용자 데이터 로드
    async loadUserData() {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const response = await fetch(`${apiUrl}/api/user/${this.userNum}`);
            const data = await response.json();

            if (data.result === 'success') {
                const userData = data.apiData;
                this.setProfileImage(userData.profileImage);
                this.setNickname(userData.nickname);
                this.setUserNum(userData.userNum);
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    getProfileImage() {
        return this.profileImage;
    }

    setProfileImage(newImage) {
        this.profileImage = newImage;
        localStorage.setItem('profileImage', newImage);
        this.notifySubscribers();
    }

    getNickname() {
        return this.nickname;
    }

    setNickname(newNickname) {
        this.nickname = newNickname;
        localStorage.setItem('nickname', newNickname);
        this.notifySubscribers();
    }

    getUserNum() {
        return this.userNum;
    }

    setUserNum(newUserNum) {
        this.userNum = newUserNum;
        localStorage.setItem('userNum', String(newUserNum));
        this.notifySubscribers();
    }

    // 로그인 시 사용자 정보 설정
    setUserInfo(userInfo) {
        this.setUserNum(userInfo.userNum);
        this.setNickname(userInfo.nickname);
        this.setProfileImage(userInfo.profileImage);
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter(sub => sub !== callback);
    }

    notifySubscribers() {
        const updatedProfile = {
            profileImage: this.profileImage,
            nickname: this.nickname,
            userNum: this.userNum,
        };
        this.subscribers.forEach(callback => callback(updatedProfile));
    }
}

const profileStore = new ProfileStore();
export default profileStore;