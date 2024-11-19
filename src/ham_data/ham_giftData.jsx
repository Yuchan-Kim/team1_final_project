// src/ham_data/ham_giftData.jsx

import GiftImage1 from '../ham_asset/images/gift1.jpg';
import GiftImage2 from '../ham_asset/images/gift2.jpg';
import GiftImage3 from '../ham_asset/images/gift3.jpg';
import GiftImage4 from '../ham_asset/images/gift4.jpg';
import GiftImage5 from '../ham_asset/images/gift5.jpg';
import GiftImage6 from '../ham_asset/images/gift6.jpg';
import GiftImage7 from '../ham_asset/images/gift7.jpg';
// ... 다른 기프티콘 이미지 import (추가 필요 시 여기에 추가)

export const giftItems = [
    { id: 1, name: "눼눼칙힌", image: GiftImage1, description: "눼눼칙힌에서 사용할 수 있는 기프티콘입니다.", isUsed: false, },
    { id: 2, name: "BBQ", image: GiftImage2, description: "BBQ에서 사용할 수 있는 기프티콘입니다.", isUsed: true },
    { id: 3, name: "피자혓", image: GiftImage3, description: "피자혓에서 사용할 수 있는 기프티콘입니다.", isUsed: false },
    { id: 4, name: "나눔로또", image: GiftImage4, description: "나눔로또 기프티콘입니다.", isUsed: true },
    { id: 5, name: "칙힌깊흐트", image: GiftImage5, description: "칙힌을 먹을 수 있는 기프티콘입니다.", isUsed: true },
    { id: 6, name: "배라기프티콘", image: GiftImage6, description: "배숙희라임스에서 사용할 수 있는 기프티콘입니다.", isUsed: false },
    { id: 7, name: "치킨기프트", image: GiftImage7, description: "치킨 기프티콘입니다.", isUsed: false },
    // ... 추가 기프티콘 객체 (필요 시 여기에 추가)
];