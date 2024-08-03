import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './components/Login/login';
import { SignUp } from './components/Register/signup';
import { Chat } from './components/Chat/Chat';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate('/chat')
  },[])
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/chat' element={<PrivateRoute element={Chat} />}/>
      </Routes>
    </div>
  );
}

export default App;
