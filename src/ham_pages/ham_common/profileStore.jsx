// src/ham_pages/ham_common/profileStore.js

import defaultProfile from '../../ham_asset/images/profile-fill.png';

class ProfileStore {
    constructor() {
        // localStorage에서 사용자 정보 불러오기
        this.profileImage = localStorage.getItem('profileImage') || defaultProfile;
        this.nickname = localStorage.getItem('nickname') || "비회원";
        this.userNum = parseInt(localStorage.getItem('userNum')) || this.getUserNumFromAuthUser();
        this.region = localStorage.getItem('region') || "미설정";
        this.ownedProfileImages = this.initializeOwnedProfileImages();
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
        this.token = localStorage.getItem('token') || null;
        this.subscribers = [];

        // userNum이 authUser에서 추출되었다면 localStorage에 저장
        if (this.userNum) {
            localStorage.setItem('userNum', String(this.userNum));
        }

        if (this.token) {
            this.loadUserData();
        }
    }
    
    // authUser에서 userNum 추출
    getUserNumFromAuthUser() {
        const authUserStr = localStorage.getItem('authUser');
        try {
            const authUser = JSON.parse(authUserStr);
            return authUser?.userNum || null;
        } catch (error) {
            console.error('Failed to parse authUser from localStorage:', error);
            return null;
        }
    }

    // ownedProfileImages 초기화
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

    // 토큰 설정 및 사용자 데이터 로드
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
            // authUser에서 userNum 추출하여 설정
            this.userNum = this.getUserNumFromAuthUser();
            if (this.userNum) {
                localStorage.setItem('userNum', String(this.userNum));
                this.loadUserData();
            } else {
                console.error('userNum is not available from authUser');
                this.resetUserData();
            }
        } else {
            localStorage.removeItem('nickname');
            localStorage.removeItem('authUser');
            localStorage.removeItem('ownedProfileImages');
            localStorage.removeItem('profileImage');
            localStorage.removeItem('region');
            localStorage.removeItem('userNum');
            this.resetUserData();
        }

        this.notifySubscribers(); // 토큰 변경 시 구독자에게 알림
    }

    // getToken 메소드 추가
    getToken() {
        return this.token;
    }

    // loadUserData 메소드
    async loadUserData() {
        if (!this.userNum) {
            console.error('유저번호가 없어 데이터를 불러올 수 없습니다.');
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:9000';
            const response = await fetch(`${apiUrl}/api/user/${this.userNum}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data.result === 'success' && data.apiData?.userInfo) {
                const userData = data.apiData.userInfo;

                // 챌린지 요약 정보 처리
                const challengesSummary = {
                    ongoing: Number(userData.ongoingChallenges) || 0,
                    upcoming: Number(userData.upcomingChallenges) || 0,
                    completed: Number(userData.completedChallenges) || 0,
                    participationScore: Number(userData.participationScore) || 0
                };

                // 챌린지 상세 정보 처리 
                const challengesDetails = {
                    ongoing: Array.isArray(data.apiData.challenges?.ongoing) ? data.apiData.challenges.ongoing : [],
                    upcoming: Array.isArray(data.apiData.challenges?.upcoming) ? data.apiData.challenges.upcoming : [],
                    completed: Array.isArray(data.apiData.challenges?.completed) ? data.apiData.challenges.completed : []
                };

                // 프로필 이미지 처리 개선
                const processedProfileImages = this.processProfileImages(userData.ownedProfileImages);

                // 데이터 업데이트
                this.updateUserData({
                    profileImage: userData.profileImage || this.profileImage,
                    ownedProfileImages: processedProfileImages,
                    nickname: userData.nickname || this.nickname,
                    region: userData.region || this.region,
                    userNum: userData.userNum || this.userNum,
                    challengesSummary,
                    challengesDetails
                });
            } else {
                console.error('Failed to fetch user data:', data.message);
                this.resetUserData();
            }
        } catch (error) {
            console.error('유저 정보를 불러오는데 실패 했습니다:', error);
            this.handleError(error);
        }
    }

    // 프로필 이미지 처리
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

    // 에러 처리
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

    // 사용자 데이터 일괄 업데이트
    updateUserData(data) {
        this.setProfileImage(data.profileImage);
        this.setOwnedProfileImages(data.ownedProfileImages);
        this.setNickname(data.nickname);
        this.setRegion(data.region);
        this.setUserNum(data.userNum);
        this.setChallengesSummary(data.challengesSummary);
        this.setChallengesDetails(data.challengesDetails);
    }

    // getProfileImage 메소드 
    getProfileImage() {
        return this.profileImage;
    }

    // setProfileImage 메소드 
    setProfileImage(newImage) {
        this.profileImage = newImage;
        localStorage.setItem('profileImage', newImage);
        this.notifySubscribers();
    }

    // getOwnedProfileImages 메소드 
    getOwnedProfileImages() {
        const images = Array.isArray(this.ownedProfileImages) ? this.ownedProfileImages : [];
        return images.filter(img => typeof img === 'string' && img.trim().length > 0);
    }

    // setOwnedProfileImages 메소드 
    setOwnedProfileImages(images) {
        const processedImages = this.processProfileImages(images)
            .filter(img => typeof img === 'string' && img.trim().length > 0);
        this.ownedProfileImages = processedImages;
        localStorage.setItem('ownedProfileImages', JSON.stringify(processedImages));
        this.notifySubscribers();
    }

    getNickname() {
        return this.nickname;
    }

    setNickname(newNickname) {
        this.nickname = newNickname;
        localStorage.setItem('nickname', newNickname);
    
        // 기존 'authUser' 객체 가져오기
        const authUserStr = localStorage.getItem('authUser');
        if (authUserStr) {
            try {
                const authUser = JSON.parse(authUserStr);
                authUser.userName = newNickname; // 'userName' 필드 업데이트
                localStorage.setItem('authUser', JSON.stringify(authUser)); // 업데이트된 객체 다시 저장
            } catch (error) {
                console.error('Failed to parse authUser from localStorage:', error);
                // 만약 parsing에 실패하면, 'authUser'를 새 객체로 설정
                localStorage.setItem('authUser', JSON.stringify({ userName: newNickname }));
            }
        } else {
            // 'authUser'가 존재하지 않으면 새 객체로 설정
            localStorage.setItem('authUser', JSON.stringify({ userName: newNickname }));
        }
    
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
        // this.loadUserData();
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
            challengesDetails: this.challengesDetails,
            token: this.token // 토큰 포함
        };
        this.subscribers.forEach(callback => callback(updatedProfile));
    }

    // 사용자 데이터 초기화
    resetUserData() {
        this.profileImage = defaultProfile;
        this.nickname = "비회원";
        this.userNum = null;
        this.region = "UnKnown";
        this.ownedProfileImages = [];
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
        this.token = null;
        this.notifySubscribers();
    }
}

const profileStoreInstance = new ProfileStore();
export default profileStoreInstance;
