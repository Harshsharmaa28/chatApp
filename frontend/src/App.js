import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Login } from './components/Login/login';
import { SignUp } from './components/Register/signup';
import { Chat } from './components/Chat/Chat';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Homepage } from './components/Home/Homepage';


function App() {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate('/chat')
  },[])

  return (
    <div>
      <ToastContainer/>
      <Routes>
      <Route path="/" element={<Homepage/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/chat' element={<PrivateRoute element={Chat} />}/>
      </Routes>
    </div>
  );
}

export default App;
