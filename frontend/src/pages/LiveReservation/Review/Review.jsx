import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Review.css';

const Review = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [showPhotosOnly, setShowPhotosOnly] = useState(false);
  const [accommodationData, setAccommodationData] = useState({
    name: '여여',
    averageRating: 4.8,
    totalReviews: 0,
    totalReviewPhotos: 0,  // 리뷰 사진 수
    photos: []
  });

  // 숙소별 데이터 로드 함수 (향후 백엔드 API 연동 지점)
  const loadAccommodationData = async (accommodationId) => {
    try {
      // TODO: 백엔드 API 호출
      // const response = await fetch(`/api/accommodations/${accommodationId}`);
      // const data = await response.json();
      
      // 현재는 localStorage에서 숙소 정보 가져오기
      const hostsList = JSON.parse(localStorage.getItem('hostsList') || '[]');
      const currentHost = hostsList.find(host => host.id === accommodationId) || hostsList[hostsList.length - 1];
      
      // 해당 숙소의 리뷰 데이터 로드 (향후 백엔드에서 가져올 데이터)
      const accommodationReviews = await loadAccommodationReviews(accommodationId);
      const reviewPhotos = await loadReviewPhotos(accommodationId);
      
      // 평점 계산
      const averageRating = accommodationReviews.length > 0 
        ? (accommodationReviews.reduce((sum, review) => sum + review.rating, 0) / accommodationReviews.length).toFixed(1)
        : 4.8;

      setAccommodationData({
        name: currentHost?.houseName || '여여',
        averageRating: parseFloat(averageRating),
        totalReviews: accommodationReviews.length,
        totalReviewPhotos: reviewPhotos.length,  // 리뷰 사진 수
        photos: reviewPhotos.slice(0, 5)  // 처음 5개만 미리보기로 표시
      });

      setReviews(accommodationReviews);
    } catch (error) {
      console.error('숙소 데이터 로드 실패:', error);
      // 에러 시 기본값 사용
      setAccommodationData({
        name: '여여',
        averageRating: 4.8,
        totalReviews: 4,
        totalReviewPhotos: 125,  // 기본 리뷰 사진 수
        photos: []
      });
      setReviews(getDefaultReviews());
    }
  };

  // 숙소별 리뷰 로드 함수 (향후 백엔드 API 연동 지점)
  const loadAccommodationReviews = async (accommodationId) => {
    try {
      // TODO: 백엔드 API 호출
      // const response = await fetch(`/api/accommodations/${accommodationId}/reviews`);
      // return await response.json();
      
      // 현재는 localStorage에서 해당 숙소 리뷰만 필터링
      const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const accommodationReviews = allReviews.filter(review => 
        review.accommodationId === accommodationId || 
        review.houseName === accommodationData.name
      );

      // 리뷰가 없으면 더미 데이터 반환
      return accommodationReviews.length > 0 ? accommodationReviews : getDefaultReviews();
    } catch (error) {
      console.error('리뷰 데이터 로드 실패:', error);
      return getDefaultReviews();
    }
  };

  // 숙소별 리뷰 사진 로드 함수 (향후 백엔드 API 연동 지점)
  const loadReviewPhotos = async (accommodationId) => {
    try {
      // TODO: 백엔드 API 호출
      // const response = await fetch(`/api/accommodations/${accommodationId}/review-photos`);
      // return await response.json();
      
      // 현재는 더미 데이터 반환 (리뷰에 첨부된 사진들)
      return Array.from({ length: 125 }, (_, index) => ({
        id: index + 1,
        url: `/images/review_photo_${accommodationId}_${index + 1}.jpg`,
        accommodationId: accommodationId,
        reviewId: Math.floor(index / 3) + 1,  // 리뷰 ID (한 리뷰당 대략 3장씩)
        uploadedAt: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString()
      }));
    } catch (error) {
      console.error('리뷰 사진 데이터 로드 실패:', error);
      return [];
    }
  };

  // 기본 리뷰 데이터 (더미 데이터)
  const getDefaultReviews = () => {
    return [
      {
        id: 1,
        accommodationId: roomId,
        userName: '아야',
        userCode: '****',
        date: '2024.11.13',
        rating: 2,
        comment: '친절하신 할머니 덕분에 좋은 추억이 됐어요. 할머니께서 직접 키우신 농작물로 음식을 만들어 주셔서 너무 맛있었어요! 농장 체험도 즐거웠고 서울에서는 느낄 수 없는 여유로움을 만끽할 수 있었어요. 다음에도 꼭 방문하고 싶어요. 감사합니다.',
        hasPhotos: false,
        photos: []
      },
      {
        id: 2,
        accommodationId: roomId,
        userName: '모모',
        userCode: '****',
        date: '2024.06.24',
        rating: 5,
        comment: '너무 좋았어요! 할머니가 너무 친절하셨어요.',
        hasPhotos: false,
        photos: []
      },
      {
        id: 3,
        accommodationId: roomId,
        userName: '지영',
        userCode: '****',
        date: '2024.05.15',
        rating: 4,
        comment: '시골의 정취를 느낄 수 있는 좋은 숙소였습니다. 할머니 손맛이 정말 일품이에요!',
        hasPhotos: true,
        photos: [
          { id: 1, url: '/images/review1_1.jpg', alt: '숙소 내부' },
          { id: 2, url: '/images/review1_2.jpg', alt: '할머니 요리' },
          { id: 3, url: '/images/review1_3.jpg', alt: '숙소 전경' }
        ]
      },
      {
        id: 4,
        accommodationId: roomId,
        userName: '민수',
        userCode: '****',
        date: '2024.04.20',
        rating: 5,
        comment: '가족과 함께 편안한 시간을 보냈습니다. 추천해요!',
        hasPhotos: true,
        photos: [
          { id: 4, url: '/images/review2_1.jpg', alt: '가족 사진' },
          { id: 5, url: '/images/review2_2.jpg', alt: '숙소 방' }
        ]
      }
    ];
  };

  useEffect(() => {
    if (roomId) {
      loadAccommodationData(roomId);
    }
  }, [roomId]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'filled' : 'empty'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 사진후기만 보기 필터링
  const filteredReviews = showPhotosOnly 
    ? reviews.filter(review => review.hasPhotos) 
    : reviews;

  return (
    <div className="review-page">
      {/* 숙소 이름과 평점 */}
      <div className="accommodation-rating">
        <h2>{accommodationData.name}</h2>
        <div className="rating-display">
          <span className="rating-star">★</span>
          <span className="rating-number">{accommodationData.averageRating}</span>
        </div>
      </div>

      {/* 할매집 사진 */}
      <div className="review-photos-section">
        <h3>할매집 사진</h3>
        <div 
          className="photo-count"
          onClick={() => navigate(`/live-reservation/review-photos/${roomId}`)}
        >
          전체보기 ({accommodationData.totalReviewPhotos}) &gt;
        </div>
        <div className="photos-grid">
          {accommodationData.photos.map((photo, index) => (
            <div key={index} className="photo-item">
              <div className="photo-placeholder">
                사진 {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 후기 총 수 */}
      <div className="review-count-section">
        <h3>후기 ({accommodationData.totalReviews.toLocaleString()})</h3>
      </div>

      {/* 사진후기만 보기 옵션 */}
      <div className="photo-filter-section">
        <div className="photo-filter">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showPhotosOnly}
              onChange={(e) => setShowPhotosOnly(e.target.checked)}
            />
            사진후기만 보기
          </label>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="reviews-list">
        {filteredReviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header-info">
              <div className="user-info">
                <span className="user-name">{review.userName}</span>
              </div>
              <span className="review-date">{review.date}</span>
            </div>
            
            <div className="review-content">
              <div className="rating-stars">
                {renderStars(review.rating)}
              </div>
              
              {/* 리뷰 사진들 */}
              {review.hasPhotos && review.photos && review.photos.length > 0 && (
                <div className="review-photos">
                  {review.photos.map((photo) => (
                    <div key={photo.id} className="review-photo-item">
                      <div className="review-photo-placeholder">
                        사진 {photo.id}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <p className="review-text">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
