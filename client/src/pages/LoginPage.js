import { Link, useNavigate  } from "react-router-dom";
import React, { useState } from 'react';
import styles from '../styles/LoginPage.module.css';


function LoginPage() {
  const [id, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handlerLogin = async () => {
    try {
      if(id.trim() === '') {
        alert('아이디를 입력하세요.')
        return;
      } else if(password.trim() === '') {
        alert('비밀번호를 입력하세요.')
        return;
      } 

      const response = await fetch(`http://10.0.0.4:5000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, password })
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();

        // 토큰과 ID를 받아옴
        const { token, userId } = data;
        console.log(token, userId)
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        navigate("/");
        // 토큰을 로컬 스토리지 등에 저장하고 필요한 곳에서 활용할 수 있음
        // 토큰 가져올때
        // localStorage.getItem('token');
        // 토큰 지울때
        // localStorage.removeItem('accessToken');

        console.log('로그인 성공! 토큰:', token);
      } else {
        const data = await response.json();
        console.log('로그인 실패!');
        alert(data.message)
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  return (
    <>
      <div>
        <div className={styles.signupbox}>
          <div className={styles.signupboxtitle}>
            <h2>로그인</h2>
          </div>
          <div className={styles.insertBox}>                     
              <input className={styles.inputField} type="text" placeholder="아이디" value={id} onChange={(e) => setUsername(e.target.value)} />
              <input className={styles.inputField} type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />    
          </div>
          <div style={{textAlign: 'center'}}>
            <div>
            <button className={styles.signupbutton} onClick={handlerLogin}>로그인</button>
            </div>
            <div>
            <Link to='/login/signup'><button className={styles.loginbutton}>회원가입</button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;