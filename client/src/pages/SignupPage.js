import { useRef, useState } from "react";
import { Link , useNavigate} from "react-router-dom";


function SignupPage() {
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState({
      userId: '',
      userPwd1: '',
      userPwd2: '',
      userPhone: '',
      userNickname: ''
    });

    const refUserId = useRef();
    const refUserPwd1 = useRef();
    const refUserPwd2 = useRef();
    const refUserPhone = useRef();
    const refUserNickname = useRef();

    const handlerChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handlerClick = async (e) => {
      e.preventDefault();

      const { userId, userPwd1, userPwd2, userPhone, userNickname } = formData;

      try { 
        if (userId.trim() === '') {
                  alert('아이디를 입력하세요.');
                  refUserId.current.focus();
                  return;
        };
        
        if (userPwd1.trim() === '') {
            alert('비밀번호를 입력하세요.');
            refUserPwd1.current.focus();
            return;
        };

        if (userPwd2.trim() === '') {
            alert('비밀번호 확인을 입력하세요.');
            refUserPwd2.current.focus();
            return;
        };

        if (userPhone.trim() === '') {
          alert('전화번호를 입력하세요.');
          refUserPhone.current.focus();
          return;
        };

        if (userNickname.trim() === '') {
          alert('닉네임을 입력하세요.');
          refUserNickname.current.focus();
          return;
        };
  
        if (userPwd1.trim() !== userPwd2.trim()) {
            alert('패스워드가 일치하지 않습니다.');
            setFormData({ ...formData, userPwd1: '', userPwd2: '' });
            refUserPwd1.current.focus();
            return;
        };
  
        alert(`ID: ${userId}\nPWD1: ${userPwd1}\nPWD2: ${userPwd2}\nPHONE: ${userPhone}\nNICKNAME: ${userNickname}`);
        
        const response = await fetch(`http://10.0.0.4:5000/login/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId, userPwd1, userPhone, userNickname })
        });
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          const { token, userId } = data;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          alert(data.message);
          navigate("/");
  
          console.log('로그인 성공! 토큰:', token);
        } else {
          const data = await response.json();
          console.log('로그인 실패!');
          alert(data.message);
        }
      } catch (error) {
        console.error('로그인 중 오류 발생:', error);
      }
    };
    
    return (
      <>
        <div className="signupbox">
            <div className="signupboxtitle">
                <h1>회원가입</h1>
            </div>
            <div className="insertBox">
              <input className="inputField" placeholder="아이디" ref={refUserId} type="text" name="userId" value={formData.userId} onChange={handlerChange} /><br />
              <input className="inputField" placeholder="비밀번호" ref={refUserPwd1} type="password" name="userPwd1" value={formData.userPwd1} onChange={handlerChange} /><br />
              <input className="inputField" placeholder="비밀번호 확인" ref={refUserPwd2} type="password" name="userPwd2" value={formData.userPwd2} onChange={handlerChange} /> <br />
              <input className="inputField" placeholder="휴대폰 번호" ref={refUserPhone} type="text" name="userPhone" value={formData.userPhone} onChange={handlerChange} /><br />
              <input className="inputField" placeholder="닉네임" ref={refUserNickname} type="text" name="userNickname" value={formData.userNickname} onChange={handlerChange} /><br />
            </div>
            <div style={{textAlign: 'center'}}>
              <Link to='/'><button className="signupbutton" type="submit" onClick={handlerClick}>가입하기</button></Link>
            </div>
        </div>
      </>
    );
  }
  
  
  export default SignupPage;