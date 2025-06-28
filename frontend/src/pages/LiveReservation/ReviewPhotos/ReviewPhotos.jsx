import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ReviewPhotos.css';

const ReviewPhotos = () => {
  const { roomId } = useParams();
  
  const [photos, setPhotos] = useState([]);
  const [accommodationName, setAccommodationName] = useState('여여');

  // 더미 사진 데이터 (실제로는 백엔드에서 가져올 데이터)
  const samplePhotos = [
    { id: 1, url: '/images/review_photo_1.jpg', reviewId: 1, uploadedAt: '2024.11.13', likes: 15 },
    { id: 2, url: '/images/review_photo_2.jpg', reviewId: 1, uploadedAt: '2024.11.13', likes: 8 },
    { id: 3, url: '/images/review_photo_3.jpg', reviewId: 2, uploadedAt: '2024.11.10', likes: 22 },
    { id: 4, url: '/images/review_photo_4.jpg', reviewId: 3, uploadedAt: '2024.11.08', likes: 12 },
    { id: 5, url: '/images/review_photo_5.jpg', reviewId: 3, uploadedAt: '2024.11.08', likes: 18 },
    { id: 6, url: '/images/review_photo_6.jpg', reviewId: 4, uploadedAt: '2024.11.05', likes: 25 },
    { id: 7, url: '/images/review_photo_7.jpg', reviewId: 5, uploadedAt: '2024.11.03', likes: 14 },
    { id: 8, url: '/images/review_photo_8.jpg', reviewId: 5, uploadedAt: '2024.11.03', likes: 9 },
    { id: 9, url: '/images/review_photo_9.jpg', reviewId: 6, uploadedAt: '2024.11.01', likes: 31 },
    { id: 10, url: '/images/review_photo_10.jpg', reviewId: 7, uploadedAt: '2024.10.28', likes: 16 },
    { id: 11, url: '/images/review_photo_11.jpg', reviewId: 7, uploadedAt: '2024.10.28', likes: 11 },
    { id: 12, url: '/images/review_photo_12.jpg', reviewId: 8, uploadedAt: '2024.10.25', likes: 20 }
  ];

  useEffect(() => {
    // 숙소 정보 가져오기
    const hostsList = JSON.parse(localStorage.getItem('hostsList') || '[]');
    if (hostsList.length > 0) {
      const currentHost = hostsList.find(host => host.id === roomId) || hostsList[hostsList.length - 1];
      setAccommodationName(currentHost?.houseName || '여여');
    }

    // 사진 데이터 설정
    setPhotos(samplePhotos);
  }, [roomId]);

  return (
    <div className="review-photos-page">
      {/* 헤더 */}
      <div className="photos-header">
        <h1>숙소 후기사진</h1>
      </div>

      {/* 객실 전체 텍스트 */}
      <div className="photos-filter">
        <span className="filter-text">객실 전체 (125)</span>
      </div>

      {/* 사진 그리드 */}
      <div className="photos-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-grid-item">
            <div className="photo-placeholder">
              사진 {photo.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPhotos; 