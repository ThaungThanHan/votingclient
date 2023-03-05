import logo from './logo.svg';
// import './styles/App.scss';
import Homepage from './components/homepage';
import VotingRoom from './components/VotingRoom';
import CreateVotingRoom from './components/createVotingRoom';
import SignUp from './components/signup';
import Login from './components/login';
import {Route, Routes} from "react-router-dom";
function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/createroom" element={<CreateVotingRoom />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/rooms/:id" element={<VotingRoom/>} />
    </Routes>
    </div>

  );
}

export default App;
