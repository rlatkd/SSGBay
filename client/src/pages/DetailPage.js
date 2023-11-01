import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../components/DetailPage.module.css";


function DetailPage() {
  const { id } = useParams();
  const [price, setPrice] = useState(0);
  const [data, setData] = useState(null); 
  let purchaseId = '';

  useEffect(() => {
    axios
      .get(`http://10.0.0.4:5000/detail/${id}`)
      .then((response) => {
        setData(response.data); 
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]); 

  const handlerSubmit = (e) => {
    e.preventDefault();
    console.log('입력한 입찰가:',price);
    console.log('이미 입찰된 가격:',data.price);
    const parsedDataPrice = parseFloat(data.price);  
    purchaseId = localStorage.getItem('userId')
    
    if (data.user_id == purchaseId) { 
      alert('본인 물건은 입찰 불가능입니다. ');
      return;
    }

    if (purchaseId == '') { 
      alert('로그인 후 입찰 가능합니다. ');
      return;
    }

    if (price <= data.price) {
      alert('현재 낙찰 예정 금액 이하로는 입찰할 수 없습니다.');
      return;
    } else {
      const koreanFormattedDate = formatDate(data.endTime);
      alert('낙찰 성공! 낙찰날짜는 ' + koreanFormattedDate + ' 입니다. ');
      data.price = price
    }
   
    axios
      .put(`http://10.0.0.4:5000/detail/${id}`, { price: price })
      .then((response) => {
        setData({ ...data, price: price });
        console.log("가격이 업데이트되었습니다.");

        const datas = new FormData();
        datas.append('itemId', data.id);
        datas.append('userId', purchaseId);
        datas.append('endTime', data.endTime);
        console.log(data.id)
        console.log(purchaseId)

        return axios.post(`http://10.0.0.4:5000/history`, datas);
      })
      .catch((error) => {
        console.error(error);
      });
  };
 
  const handlerPrice = (e) => {
    setPrice(e.target.value);
  };

  if (data === null) {
    return <div>Loading...</div>;
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Date 객체를 한국 시간으로 변환
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'Asia/Seoul',
    };
  
    // 한국어로 날짜 및 시간 형식 변환
    const koreanDate = new Intl.DateTimeFormat('ko-KR', options).format(date);
    // const startTime = new Intl.DateTimeFormat('ko-KR', options).format(data.startTime);
    return koreanDate;
  };
  const startTime = formatDate(data.startTime);
  const endTime = formatDate(data.endTime);
  return (
    <div className={styles.outerContainer}>
      <div className={styles.topSection}>
        <img className={styles.itemImg} src={`${data.image}`} alt="itemImage" />
        <div className={styles.info}>
          <div className={styles.title}>{data.name}</div>
          <div className={styles.price}>현재 낙찰 예정 금액 : {data.price} 원</div>
          <div className={styles.date}>경매 시작 시간: {startTime}</div>
          <div className={styles.date}>경매 만료 시간: {endTime}</div>
          <form className={styles.form} onSubmit={handlerSubmit}>
            <input
              className={styles.input}
              type="number"
              value={price}
              onChange={handlerPrice}
            />
            <button className={styles.bidButton}>입찰</button>
          </form>
        </div>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.bottomLeftSection}>
          <div className={styles.itemInfo}>상품정보</div>
          <div>{data.content}</div>
        </div>
        <div className={styles.bottomRightSection}>
          <div className={styles.userInfo}>경매자</div>
          <div>
            <div>ID: {data.user_id}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPage;