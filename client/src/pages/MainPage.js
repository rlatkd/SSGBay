import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/MainPage.module.css";
import Card from "../styles/Card";
import { useLocation } from "react-router-dom";


function MainPage() {
  const location = useLocation();
  const query = location.state?.query.trim() || '';
  const [sortMethod, setSortMethod] = useState("date");
  const [itemDataList, setItemDataList] = useState([]);

  useEffect(() => {
      const queryString = `sort=${sortMethod}&keyword=${query}`;
      axios
        .get(`http://10.0.0.4:5000?${queryString}`)
        .then((itemData) => {
          console.log(itemData.data)
          setItemDataList(itemData.data);
          window.scrollTo(0, 0);
        })
      .catch((error) => {
        console.error(error);
      });
  }, [sortMethod, query]);

  const handlerSortChange = (e) => {
    console.log(`${e.target.value}순으로 정렬합니다.`);
    setSortMethod(e.target.value);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.dropDownContainer}>
        <select
          className={styles.dropDown}
          id="sort"
          onChange={handlerSortChange}
        >
          <option value="date">최신순</option>
          <option value="priceDown">높은 가격순</option>
          <option value="priceUp">낮은 가격순</option>
        </select>
      </div>
      <div className={styles.cardContainer}>
        {itemDataList.map((cardInfo) => (
          <Card key={cardInfo.id} cardInfo={cardInfo} />
        ))}
      </div>
    </div>
  );
}

export default MainPage;