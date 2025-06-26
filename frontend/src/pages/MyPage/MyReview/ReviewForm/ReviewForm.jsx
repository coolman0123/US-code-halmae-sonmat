import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import SelectButton from '../../../../components/Button/Button';
import whiteCamera from '../../../../assets/icons/흰카메라.png';
import blackCamera from '../../../../assets/icons/검정카메라.png';
import roomImg from '../../../../assets/images/내 결제_숙소.png';
import './ReviewForm.css';

const ReviewForm = () => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [content, setContent] = useState('');
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');

  const dummyData = [
    {
      id: 1,
      location: '여여',
      date: '2025.06.24',
      description: '"말보단 손이 빠른" 박봉순 할머니',
    },
    {
      id: 2,
      location: '모모',
      date: '2025.05.24',
      description: '"입은 좀 험하지만 속은 꿀" 김옥순 할머니',
    },
    {
      id: 3,
      location: '소소',
      date: '2025.04.14',
      description: '"전쟁통에도 솥은 놓지 않았다" 이금자 할머니',
    },
    {
      id: 4,
      location: '호호',
      date: '2025.03.14',
      description: '"한 마디면 눈물 터지는" 정다감 할머니',
    },
    {
      id: 5,
      location: '패밀리',
      date: '2025.03.02',
      description: '"메뉴는 고정, 맛은 고정불변" 조말순 할머니',
    },
  ];

  const data = dummyData.find((item) => item.id === Number(id)) || {};

  const handlePhotoUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...photos, ...selectedFiles].slice(0, 5);
    setPhotos(totalFiles);
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
      <h2 className='review-title'>후기 작성</h2>

      <div className='room-info'>
        <img src={roomImg} alt='숙소 이미지' />
        <div>
          <div className='room-title'>{data.location}</div>
          <div className='room-date'>{data.date}</div>
          <div className='room-desc'>{data.description}</div>
        </div>
      </div>

      <div className='rating-section'>
        <h3>숙소는 어땠나요?</h3>
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
                  size={36}
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

      <div className='experience-section'>
        <h3>숙소에서의 경험을 공유해 주세요</h3>
        <div className='guide-box'>
          <b>이렇게 작성하면 좋아요!</b>
          <p>청결도, 서비스 등 숙소에 대한 전반적인 경험을 작성해 주세요.</p>
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
            <img
              key={index}
              src={URL.createObjectURL(file)}
              alt={`preview-${index}`}
              className='photo-preview'
            />
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
        <label htmlFor='photo-upload'>
          <SelectButton
            selected={photos.length > 0}
            icon={photos.length > 0 ? whiteCamera : blackCamera}
            text={`사진 추가하기 (${photos.length}/5)`}
          />
        </label>

        <SelectButton
          text='등록 완료'
          selected={content.length >= 10}
          disabled={content.length < 10}
          onClick={() => {
            if (content.length >= 10) {
              alert('후기 등록 완료');
            }
          }}
        />
      </div>
    </div>
  );
};

export default ReviewForm;
