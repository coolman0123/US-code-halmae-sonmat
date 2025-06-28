import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import SelectButton from '../../../../components/Button/Button';
import whiteCamera from '../../../../assets/icons/흰카메라.png';
import blackCamera from '../../../../assets/icons/검정카메라.png';
import roomImg from '../../../../assets/images/내 결제_숙소.png';
import './ReviewForm.css';

const ReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const [hasRuralExperience, setHasRuralExperience] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSelectedTripData();
  }, [id, navigate]);

  const loadSelectedTripData = async () => {
    try {
      setLoading(true);
      
      // 로그인한 사용자 정보 확인
      const userData = localStorage.getItem("currentUser");
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      
      if (!isLoggedIn || isLoggedIn !== "true" || !userData) {
        navigate("/auth/login");
        return;
      }

      const user = JSON.parse(userData);
      setCurrentUser(user);

      // WriteReview에서 선택된 여행 정보 가져오기
      const selectedTripData = localStorage.getItem('selectedTripForReview');
      if (selectedTripData) {
        const tripData = JSON.parse(selectedTripData);
        console.log('리뷰 작성용 선택된 여행 데이터:', tripData);
        
        // ID가 일치하는지 확인
        if (tripData.id === Number(id)) {
          setSelectedTrip(tripData);
        } else {
          console.error('ID가 일치하지 않습니다:', tripData.id, id);
          navigate('/mypage/review/write');
        }
      } else {
        console.error('선택된 여행 데이터가 없습니다.');
        navigate('/mypage/review/write');
      }
    } catch (error) {
      console.error('여행 데이터 로드 오류:', error);
      navigate('/mypage/review/write');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      // 입력 유효성 검사
      if (rating === 0) {
        setError('별점을 선택해주세요.');
        return;
      }

      if (content.length < 10) {
        setError('후기는 최소 10자 이상 작성해주세요.');
        return;
      }

      if (!currentUser || !selectedTrip) {
        alert('필요한 정보가 없습니다. 다시 시도해주세요.');
        return;
      }

      setSubmitting(true);
      setError('');

      console.log('리뷰 작성 시작:', {
        userId: currentUser.id,
        tripId: selectedTrip.tripId,
        hostId: selectedTrip.hostId,
        paymentId: selectedTrip.paymentId
      });

      // 실제 백엔드 API로 리뷰 데이터 전송
      const reviewData = {
        userId: currentUser.id,
        tripId: selectedTrip.tripId,
        hostId: selectedTrip.hostId,
        paymentId: selectedTrip.paymentId,
        rating: rating,
        content: content,
        hasRuralExperience: hasRuralExperience,
        // photos: photos, // 파일 업로드는 추후 구현
        tripDetails: {
          tripTitle: selectedTrip.location,
          tripDate: selectedTrip.date,
          hostName: selectedTrip.hostData?.name || '할머니',
          location: selectedTrip.hostData?.address || selectedTrip.description
        }
      };

      console.log('전송할 리뷰 데이터:', reviewData);

      const response = await fetch('https://us-code-halmae-sonmat.onrender.com/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('리뷰 등록에 실패했습니다.');
      }

      const result = await response.json();
      console.log('리뷰 등록 결과:', result);

      if (!result.success) {
        throw new Error(result.message || '리뷰 등록에 실패했습니다.');
      }

      // 백엔드 저장 성공 시 로컬 스토리지에도 저장 (캐시 목적)
      const localReview = {
        id: result.data.id,
        userId: currentUser.id,
        tripId: selectedTrip.tripId,
        hostId: selectedTrip.hostId,
        paymentId: selectedTrip.paymentId,
        place: selectedTrip.location,
        date: selectedTrip.date,
        hostName: selectedTrip.hostData?.name || '할머니',
        quote: selectedTrip.description,
        rating: rating,
        content: content,
        hasRuralExperience: hasRuralExperience,
        photos: photos.map(file => URL.createObjectURL(file)),
        createdAt: result.data.createdAt || new Date().toISOString()
      };

      // localStorage에 리뷰 저장 (기존 기능 유지)
      const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '{}');
      if (!existingReviews[currentUser.id]) {
        existingReviews[currentUser.id] = [];
      }
      existingReviews[currentUser.id].push(localReview);
      localStorage.setItem('userReviews', JSON.stringify(existingReviews));

      // 선택된 여행 정보 삭제
      localStorage.removeItem('selectedTripForReview');

      alert(`✅ 리뷰가 성공적으로 등록되었습니다!\n\n🏠 ${selectedTrip.location}\n⭐ ${rating}점\n📝 ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);
      navigate('/mypage/review/list');

    } catch (error) {
      console.error('리뷰 제출 오류:', error);
      setError(error.message || '리뷰 등록 중 오류가 발생했습니다.');
      
      // API 오류 시에도 로컬 스토리지에 저장 (fallback)
      try {
        const fallbackReview = {
          id: Date.now(),
          userId: currentUser.id,
          place: selectedTrip.location,
          date: selectedTrip.date,
          quote: selectedTrip.description,
          rating: rating,
          content: content,
          hasRuralExperience: hasRuralExperience,
          photos: photos.map(file => URL.createObjectURL(file)),
          createdAt: new Date().toISOString(),
          isLocal: true // 로컬 저장 표시
        };

        const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '{}');
        if (!existingReviews[currentUser.id]) {
          existingReviews[currentUser.id] = [];
        }
        existingReviews[currentUser.id].push(fallbackReview);
        localStorage.setItem('userReviews', JSON.stringify(existingReviews));

        alert('⚠️ 서버 오류로 인해 리뷰가 임시 저장되었습니다.\n나중에 다시 동기화됩니다.');
        navigate('/mypage/review/list');
      } catch (localError) {
        console.error('로컬 저장 오류:', localError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='review-form-wrapper'>
        <div className='loading-container'>
          <div className='loading-spinner'>🔄</div>
          <p>리뷰 작성 페이지를 준비하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!selectedTrip) {
    return (
      <div className='review-form-wrapper'>
        <div className='error-container'>
          <h3>❌ 여행 정보를 찾을 수 없습니다</h3>
          <p>리뷰를 작성할 여행을 다시 선택해주세요.</p>
          <button onClick={() => navigate('/mypage/review/write')} className='retry-button'>
            여행 선택하러 가기
          </button>
        </div>
      </div>
    );
  }

  const handlePhotoUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...photos, ...selectedFiles].slice(0, 5);
    setPhotos(totalFiles);
  };

  const handlePhotoDelete = (indexToDelete) => {
    const updatedPhotos = photos.filter((_, index) => index !== indexToDelete);
    setPhotos(updatedPhotos);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    if (value.length === 0) {
      setError('');
    } else if (value.length < 10) {
      setError('후기는 최소 10자 이상 작성해주세요.');
    } else {
      setError('');
    }
  };

  return (
    <div className='review-form-wrapper'>
      <div className='page-header'>
        <h2 className='review-title'>📝 리뷰 작성</h2>
        <p>소중한 경험을 다른 분들과 공유해주세요</p>
      </div>

      <div className='room-info'>
        <img 
          src={selectedTrip.hostData?.housePhotos?.[0] || roomImg} 
          alt='숙소 이미지' 
        />
        <div className='room-details'>
          <div className='room-title'>🏠 {selectedTrip.location}</div>
          <div className='room-date'>📅 {selectedTrip.date}</div>
          <div className='room-price'>💰 {selectedTrip.price}</div>
          <div className='room-desc'>👵 {selectedTrip.description}</div>
          {selectedTrip.tripData && (
            <div className='trip-period'>
              🗓️ {selectedTrip.tripData.startDate} ~ {selectedTrip.tripData.endDate}
            </div>
          )}
        </div>
      </div>

      <div className='rating-section'>
        <h3>할매집은 어땠나요?</h3>
        <div className='stars'>
          {[...Array(5)].map((_, i) => {
            const currentRating = i + 1;
            return (
              <label key={i}>
                <input
                  type='radio'
                  name='rating'
                  value={currentRating}
                  onClick={() => setRating(currentRating)}
                  style={{ display: 'none' }}
                />
                <FaStar
                  className='star'
                  color={currentRating <= (hover || rating) ? '#000' : '#ddd'}
                  size={45}
                  onMouseEnter={() => setHover(currentRating)}
                  onMouseLeave={() => setHover(null)}
                />
              </label>
            );
          })}
        </div>
        <p className='rating-text'>
          {rating === 5
            ? '최고예요'
            : rating === 4
            ? '좋아요'
            : rating === 3
            ? '보통이에요'
            : rating === 2
            ? '그저 그래요'
            : rating === 1
            ? '별로예요'
            : ''}
        </p>
      </div>

      <div className='rural-experience-section'>
        <h3>일손 돕기 체험을 하셨나요?</h3>
        <div className='checkbox-wrapper'>
          <label className='checkbox-label'>
            <input
              type='checkbox'
              checked={hasRuralExperience}
              onChange={(e) => setHasRuralExperience(e.target.checked)}
              className='checkbox-input'
            />
            <span className='checkbox-custom'></span>
            네
          </label>
        </div>
      </div>

      <div className='experience-section'>
        <h3>할매집에서의 경험을 공유해 주세요</h3>
        <div className='guide-box'>
          <b>이렇게 작성하면 좋아요!</b>
          <p>할머니와의 추억, 이야기, 밥, 느낀점 등 전반적인 경험을 작성해주면 좋아요</p>
        </div>
        <textarea
          maxLength={1000}
          placeholder='작성한 내용은 모두가 볼 수 있으니 욕설이나 개인정보가 담긴 내용은 피해 주세요 (최소 10자 이상).'
          value={content}
          onChange={handleChange}
        />
        <div className='feedback-wrapper'>
          <p className='error-text'>{error}</p>
          <span className='char-count'>{content.length} / 1000</span>
        </div>
      </div>

      {photos.length > 0 && (
        <div className='photo-preview-list'>
          {photos.map((file, index) => (
            <div key={index} className='photo-preview-container'>
              <img
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className='photo-preview'
              />
              <button
                type='button'
                className='photo-delete-btn'
                onClick={() => handlePhotoDelete(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type='file'
        id='photo-upload'
        multiple
        accept='image/*'
        style={{ display: 'none' }}
        onChange={handlePhotoUpload}
      />
      <div className='button-group'>
        <div onClick={() => document.getElementById('photo-upload').click()}>
          <SelectButton
            selected={photos.length > 0}
            icon={photos.length > 0 ? whiteCamera : blackCamera}
            text={`사진 추가하기 (${photos.length}/5)`}
          />
        </div>

        <SelectButton
          text={submitting ? '📤 등록 중...' : '✅ 등록 완료'}
          selected={content.length >= 10 && rating > 0 && !submitting}
          disabled={content.length < 10 || rating === 0 || submitting}
          onClick={handleSubmitReview}
        />
      </div>
    </div>
  );
};

export default ReviewForm;
