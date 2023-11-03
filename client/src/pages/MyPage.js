import React, { useState, useEffect } from "react";
import styles from "../styles/MyPage.module.css";
import axios from "axios";
import Card from "../styles/Card";


function MyPage() {
  const [curTab, setCurTab] = useState("PurchaseHistory");
  const [buyItem, setBuyItem] = useState([]);
  const [myItem, setMyItem] = useState([]);

  useEffect(() => {
    if (curTab === "PurchaseHistory") {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      axios
        .get(`http://10.0.0.4:5000/mypage/buyitem?id=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }) 
        .then((itemData) => {
          return setBuyItem(itemData.data);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }

    if (curTab === "ViewPosts") {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      axios
        .get(`http://10.0.0.4:5000/mypage/myitem?id=${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }) 
        .then((itemData) => {
          return setMyItem(itemData.data);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, [curTab]);

  const handlerCurTab = (e) => {
    if (e.target.dataset.tab) {
      setCurTab(e.target.dataset.tab);
    }
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.myPageContainer}>
        <ul className={styles.menus} onClick={handlerCurTab}>
          <li className={styles.pageTitle}>마이페이지</li>
          <li
            className={`${styles.menu} ${
              curTab === "PurchaseHistory" ? styles.selectedTab : ""
            }`}
            data-tab="PurchaseHistory"
          >
            구매내역
          </li>
          <li
            className={`${styles.menu} ${
              curTab === "ViewPosts" ? styles.selectedTab : ""
            }`}
            data-tab="ViewPosts"
          >
            내 게시글
          </li>
        </ul>
        <div className="park">
          <div className={styles.contentContainer}>
            {curTab === "PurchaseHistory"
              ? buyItem.map((cardInfo) => (
                  <Card key={cardInfo.id} cardInfo={cardInfo} />
                ))
              : myItem.map((cardInfo) => (
                  <Card key={cardInfo.id} cardInfo={cardInfo} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;