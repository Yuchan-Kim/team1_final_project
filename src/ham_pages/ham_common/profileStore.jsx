import defaultProfile from '../../ham_asset/images/profile-fill.png';

class ProfileStore {
    constructor() {
        // localStorage에서 사용자 정보 불러오기 (변경 없음)
        this.profileImage = localStorage.getItem('profileImage') || defaultProfile;
        this.nickname = localStorage.getItem('nickname') || "사용자";
        this.userNum = parseInt(localStorage.getItem('userNum')) || 1;
        this.region = localStorage.getItem('region') || "";
        console.log('로컬스토리지에 저장된 지역명: ', this.region); // 디버깅용 로그
   

        // ownedProfileImages 초기화 로직 개선
        /* 기존 코드
        const storedImages = localStorage.getItem('ownedProfileImages');
        try {
            this.ownedProfileImages = storedImages ? JSON.parse(storedImages) : [];
        } catch (error) {
            console.error('Failed to parse ownedProfileImages from localStorage:', error);
            this.ownedProfileImages = [];
        }
        */
        this.ownedProfileImages = this.initializeOwnedProfileImages();

        // 기존 코드 유지
        this.challengesSummary = {
            ongoing: 0,
            upcoming: 0,
            completed: 0,
            participationScore: 0
        };
        this.challengesDetails = {
            ongoing: [],
            upcoming: [],
            completed: []
        };
        this.subscribers = [];

        if (this.userNum) {
            this.loadUserData();
        }
    }

    // 새로 추가된 메소드: ownedProfileImages 초기화
    initializeOwnedProfileImages() {
        const storedImages = localStorage.getItem('ownedProfileImages');
        try {
            if (!storedImages) return [];
            const parsedImages = JSON.parse(storedImages);
            return Array.isArray(parsedImages) ? parsedImages : [parsedImages];
        } catch (error) {
            console.error('Failed to parse ownedProfileImages from localStorage:', error);
            return [];
        }
    }

    // loadUserData 메소드 전면 수정
    async loadUserData() {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const response = await fetch(`${apiUrl}/api/user/${this.userNum}`);
            const data = await response.json();

            if (data.result === 'success' && data.apiData?.userInfo) {
                const userData = data.apiData.userInfo;
                console.log("프로필 스토어가 받은 유저 정보: ", userData);
                // 챌린지 요약 정보 처리 개선
                const challengesSummary = {
                    ongoing: Number(userData.ongoingChallenges) || 0,
                    upcoming: Number(userData.upcomingChallenges) || 0,
                    completed: Number(userData.completedChallenges) || 0,
                    participationScore: Number(userData.participationScore) || 0
                };
                console.log("프로필 스토어에서 받은 요약", challengesSummary);
                // 챌린지 상세 정보 처리 개선
                const challengesDetails = {
                    ongoing: Array.isArray(data.apiData.challenges?.ongoing) ? data.apiData.challenges.ongoing : [],
                    upcoming: Array.isArray(data.apiData.challenges?.upcoming) ? data.apiData.challenges.upcoming : [],
                    completed: Array.isArray(data.apiData.challenges?.completed) ? data.apiData.challenges.completed : []
                };
                console.log("프로필 스토어에서 받은 챌린지 목록: ", challengesDetails);
                // 프로필 이미지 처리 개선
                const processedProfileImages = this.processProfileImages(userData.ownedProfileImages);

                // 데이터 업데이트
                this.updateUserData({
                    profileImage: userData.profileImage || this.defaultProfile,
                    ownedProfileImages: processedProfileImages,
                    nickname: userData.nickname || "사용자",
                    region: userData.region || "",
                    challengesSummary,
                    challengesDetails
                });
            }
        } catch (error) {
            console.error('Failed to load user data:', error);
            this.handleError(error);
        }
    }

    // 새로 추가된 메소드: 프로필 이미지 처리
    processProfileImages(images) {
        if (typeof images === 'string') {
            try {
                const parsed = JSON.parse(images);
                return Array.isArray(parsed) ? parsed : [images];
            } catch {
                return [images];
            }
        }
        return Array.isArray(images) ? images : [];
    }

    // 새로 추가된 메소드: 에러 처리
    handleError(error) {
        this.setChallengesSummary({
            ongoing: 0,
            upcoming: 0,
            completed: 0,
            participationScore: 0
        });
        this.setChallengesDetails({
            ongoing: [],
            upcoming: [],
            completed: []
        });
    }

    // 새로 추가된 메소드: 사용자 데이터 일괄 업데이트
    updateUserData(data) {
        this.setProfileImage(data.profileImage);
        this.setOwnedProfileImages(data.ownedProfileImages);
        this.setNickname(data.nickname);
        this.setRegion(data.region);
        this.setChallengesSummary(data.challengesSummary);
        this.setChallengesDetails(data.challengesDetails);
    }

    // getProfileImage 메소드 (변경 없음)
    getProfileImage() {
        return this.profileImage;
    }

    // setProfileImage 메소드 (변경 없음)
    setProfileImage(newImage) {
        this.profileImage = newImage;
        localStorage.setItem('profileImage', newImage);
        this.notifySubscribers();
    }

    // getOwnedProfileImages 메소드 수정
    /* 기존 코드
    getOwnedProfileImages() {
        return Array.isArray(this.ownedProfileImages) ? this.ownedProfileImages : [];
    }
    */
    getOwnedProfileImages() {
        const images = Array.isArray(this.ownedProfileImages) ? this.ownedProfileImages : [];
        return images.filter(img => typeof img === 'string' && img.trim().length > 0);
    }

    // setOwnedProfileImages 메소드 수정
    /* 기존 코드
    setOwnedProfileImages(ownedProfileImages) {
        if (!Array.isArray(ownedProfileImages)) {
            console.warn('ownedProfileImages is not an array. Converting to array.');
            this.ownedProfileImages = [ownedProfileImages];
        } else {
            this.ownedProfileImages = ownedProfileImages;
        }
        localStorage.setItem('ownedProfileImages', JSON.stringify(this.ownedProfileImages));
        this.notifySubscribers();
    }
    */
    setOwnedProfileImages(images) {
        const processedImages = this.processProfileImages(images)
            .filter(img => typeof img === 'string' && img.trim().length > 0);
        this.ownedProfileImages = processedImages;
        localStorage.setItem('ownedProfileImages', JSON.stringify(processedImages));
        this.notifySubscribers();
    }

    // 나머지 메소드들은 변경 없음
    getNickname() {
        return this.nickname;
    }

    setNickname(newNickname) {
        this.nickname = newNickname;
        localStorage.setItem('nickname', newNickname);
        this.notifySubscribers();
    }

    getRegion() {
        return this.region;
    }

    setRegion(newRegion) {
        if (typeof newRegion === 'string') {
            this.region = newRegion.trim();
            localStorage.setItem('region', this.region);
            console.log('Region updated:', this.region); // 디버깅용 로그
            this.notifySubscribers();
        } else {
            console.warn('Invalid region value:', newRegion);
        }
    }

    getUserNum() {
        return this.userNum;
    }

    setUserNum(newUserNum) {
        this.userNum = newUserNum;
        localStorage.setItem('userNum', String(newUserNum));
        this.loadUserData();
        this.notifySubscribers();
    }

    getChallengesSummary() {
        return this.challengesSummary;
    }

    setChallengesSummary(newSummary) {
        this.challengesSummary = newSummary;
        this.notifySubscribers();
    }

    getChallengesDetails() {
        return this.challengesDetails;
    }

    setChallengesDetails(newDetails) {
        this.challengesDetails = newDetails;
        this.notifySubscribers();
    }

    setUserInfo(userInfo) {
        this.setUserNum(userInfo.userNum);
        this.setNickname(userInfo.nickname);
        this.setRegion(userInfo.region);
        this.setProfileImage(userInfo.profileImage);
        this.setOwnedProfileImages(userInfo.ownedProfileImages);
        this.setChallengesSummary(userInfo.challengesSummary || {
            ongoing: 0,
            upcoming: 0,
            completed: 0,
            participationScore: 0
        });
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
            ownedProfileImages: this.ownedProfileImages,
            nickname: this.nickname,
            region: this.region,
            userNum: this.userNum,
            challengesSummary: this.challengesSummary,
            challengesDetails: this.challengesDetails
        };
        this.subscribers.forEach(callback => callback(updatedProfile));
    }
}

const profileStore = new ProfileStore();
export default profileStore;