import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import filledStar from '../../../../assets/icons/MyReview_채워진별.png';
import emptyStar from '../../../../assets/icons/MyReview_빈별.png';
import './ListReview.css';

const ListReview = () => {
  const [userReviews, setUserReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserReviews();
  }, [navigate]);

  const loadUserReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // 로그인한 사용자 정보 확인
      const userData = localStorage.getItem("currentUser");
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      
      if (!isLoggedIn || isLoggedIn !== "true" || !userData) {
        navigate("/auth/login");
        return;
      }

      const user = JSON.parse(userData);
      setCurrentUser(user);

      console.log('사용자 리뷰 목록 조회 시작:', user);

      // 백엔드 API에서 사용자의 리뷰 목록 조회
      const response = await fetch(
        `https://us-code-halmae-sonmat.onrender.com/api/reviews/user/${user.id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('리뷰 목록 조회에 실패했습니다.');
      }

      const result = await response.json();
      console.log('백엔드 리뷰 목록 결과:', result);

      let reviews = [];

      if (result.success && result.data && result.data.length > 0) {
        // 백엔드에서 가져온 리뷰 데이터를 UI에 맞게 변환
        reviews = result.data.map(review => ({
          id: review.id,
          userId: review.userId,
          tripId: review.tripId,
          hostId: review.hostId,
          paymentId: review.paymentId,
          place: review.tripDetails?.tripTitle || '여행',
          date: new Date(review.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\. /g, '.').replace('.', ''),
          quote: review.tripDetails?.hostName ? 
            `"${review.tripDetails.hostName}"과의 농촌 체험` :
            '할머니와 함께한 특별한 경험',
          rating: review.rating,
          content: review.content,
          hasRuralExperience: review.hasRuralExperience,
          photos: review.photos || [],
          createdAt: review.createdAt,
          isFromBackend: true
        }));

        console.log('변환된 리뷰 목록:', reviews);
      }

      // 로컬 스토리지에서도 리뷰 가져오기 (백엔드 동기화 안된 것들)
      const localReviews = JSON.parse(localStorage.getItem('userReviews') || '{}');
      const userLocalReviews = localReviews[user.id] || localReviews[user.email] || [];
      
      // 백엔드 리뷰와 로컬 리뷰 병합 (중복 제거)
      const allReviews = [...reviews];
      userLocalReviews.forEach(localReview => {
        // 백엔드에 이미 있는 리뷰는 제외
        const existsInBackend = reviews.some(backendReview => {
          return backendReview.tripId === localReview.tripId && 
                 backendReview.paymentId === localReview.paymentId;
        });
        
        if (!existsInBackend) {
          allReviews.push({
            ...localReview,
            isLocal: true // 로컬 저장 표시
          });
        }
      });

      // 최신 순으로 정렬
      const sortedReviews = allReviews.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUserReviews(sortedReviews);
      console.log('최종 리뷰 목록:', sortedReviews);

    } catch (error) {
      console.error('리뷰 목록 조회 오류:', error);
      setError(error.message);
      
      // API 오류 시 로컬 스토리지에서만 가져오기
      try {
        const localReviews = JSON.parse(localStorage.getItem('userReviews') || '{}');
        const userData = localStorage.getItem("currentUser");
        
        if (userData) {
          const user = JSON.parse(userData);
          const userLocalReviews = localReviews[user.id] || localReviews[user.email] || [];
          const sortedReviews = userLocalReviews.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setUserReviews(sortedReviews);
          console.log('로컬 스토리지 fallback 리뷰:', sortedReviews);
        }
      } catch (localError) {
        console.error('로컬 스토리지 조회 오류:', localError);
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className='written-review'>
        <div className='loading-container'>
          <div className='loading-spinner'>🔄</div>
          <p>리뷰 목록을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='written-review'>
        <div className='error-container'>
          <div className='error-message'>
            <h3>❌ 오류가 발생했습니다</h3>
            <p>{error}</p>
            <button onClick={loadUserReviews} className='retry-button'>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='written-review'>
      <div className='page-header'>
        <h2>📝 내가 작성한 리뷰</h2>
        <p>소중한 추억을 기록해주셔서 감사합니다</p>
        {userReviews.length > 0 && (
          <div className='review-stats'>
            <span className='review-count'>총 {userReviews.length}개의 리뷰</span>
            <span className='avg-rating'>
              ⭐ 평균 {(userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)}점
            </span>
          </div>
        )}
      </div>

      {userReviews.length > 0 ? (
        userReviews.map((review) => (
          <div key={review.id} className={`written-item ${review.isLocal ? 'local-review' : ''}`}>
            <div className='header'>
              <div className='left'>
                <div className='place-info'>
                  <p className='place'>
                    🏠 {review.place} <span className='arrow'>›</span>
                  </p>
                  {review.isLocal && (
                    <span className='local-badge'>📱 로컬 저장</span>
                  )}
                  {review.isFromBackend && (
                    <span className='backend-badge'>☁️ 동기화됨</span>
                  )}
                </div>
                <p className='quote'>👵 {review.quote}</p>
                <div className='stars'>
                  {[...Array(5)].map((_, i) => (
                    <img
                      key={i}
                      src={i < review.rating ? filledStar : emptyStar}
                      alt='별'
                    />
                  ))}
                  <span className='rating-text'>({review.rating}/5)</span>
                </div>
                {review.hasRuralExperience && (
                  <p className='experience-badge'>🌾 일손 돕기 체험 완료</p>
                )}
              </div>
              <div className='right'>
                <p className='date'>📅 {review.date}</p>
              </div>
            </div>
            <p className='content'>{review.content}</p>
            {review.photos && review.photos.length > 0 && (
              <div className='review-photos'>
                <div className='photos-header'>
                  <span className='photos-count'>📷 사진 {review.photos.length}장</span>
                </div>
                <div className='photos-grid'>
                  {review.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`리뷰 사진 ${index + 1}`}
                      className='review-photo'
                      onClick={() => window.open(photo, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className='no-reviews'>
          <div className='empty-state'>
            <div className='empty-icon'>📝</div>
            <h3>작성한 리뷰가 없습니다</h3>
            <p>할머니와의 소중한 경험을 리뷰로 남겨보세요!</p>
            <button 
              onClick={() => navigate('/mypage/review/write')}
              className='write-review-btn'
            >
              리뷰 작성하러 가기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListReview;
