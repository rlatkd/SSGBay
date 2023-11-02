import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import SignupPage from "./pages/SignupPage";
import DetailPage from "./pages/DetailPage";
import CreatePage from "./pages/CreatePage";
import Header from "./styles/Header";
import Footer from "./styles/Footer";
import './App.css';

function App() {
  return (
    <> 
      <Header/>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/mypage" element={<MyPage/>}/>
        <Route path="/login/signup" element={<SignupPage/>}/>
        {/* /detail/:id 형식 참고 */}
        <Route path="/detail/:id" element={<DetailPage/>}/>
        <Route path="/create" element={<CreatePage/>}/>
      </Routes>
      <Footer/>
    </>
  );
}

export default App;