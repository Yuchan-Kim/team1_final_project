import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../ham_asset/css/ham_BackgroundMusic.css'; // 정확한 CSS 경로 확인

const BackgroundMusic = ({ src, autoPlay = false, loop = true, volume = 0.5 }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        // 오디오 요소 설정
        if (audioRef.current) {
            audioRef.current.volume = volume;
            audioRef.current.loop = loop;
            audioRef.current.muted = isMuted;

            if (autoPlay) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        localStorage.setItem('backgroundMusicIsPlaying', true);
                    })
                    .catch((error) => {
                        console.error("오디오 자동 재생이 차단되었습니다:", error);
                        setIsPlaying(false);
                        localStorage.setItem('backgroundMusicIsPlaying', false);
                    });
            }
        }

        // 이전 설정 불러오기
        const savedIsPlaying = localStorage.getItem('backgroundMusicIsPlaying') === 'true';
        const savedIsMuted = localStorage.getItem('backgroundMusicIsMuted') === 'true';
        setIsPlaying(savedIsPlaying);
        setIsMuted(savedIsMuted);

        if (audioRef.current) {
            audioRef.current.muted = savedIsMuted;
            if (savedIsPlaying) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.error("오디오 자동 재생이 차단되었습니다:", error);
                        setIsPlaying(false);
                    });
            }
        }
    }, [autoPlay, loop, volume]);

    const togglePlayPause = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            localStorage.setItem('backgroundMusicIsPlaying', false);
        } else {
            audioRef.current.play()
                .then(() => {
                    setIsPlaying(true);
                    localStorage.setItem('backgroundMusicIsPlaying', true);
                })
                .catch((error) => {
                    console.error("오디오 재생이 차단되었습니다:", error);
                });
        }
    };

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(audioRef.current.muted);
        localStorage.setItem('backgroundMusicIsMuted', audioRef.current.muted);
    };

    return (
        <div className="background-music-container">
            <audio ref={audioRef} src={src} />
            <button 
                onClick={togglePlayPause} 
                className="music-control-btn" 
                aria-label={isPlaying ? "음악 일시정지" : "음악 재생"}
            >
                {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button 
                onClick={toggleMute} 
                className="music-control-btn" 
                aria-label="음소거 토글"
            >
                {isMuted ? '🔈' : '🔇'}
            </button>
        </div>
    );
};

BackgroundMusic.propTypes = {
    src: PropTypes.string.isRequired,
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool,
    volume: PropTypes.number,
};

export default BackgroundMusic;
