import logo from './logo.svg';
// import './styles/App.scss';
import Homepage from './components/homepage';
import VotingRoom from './components/VotingRoom';
import CreateVotingRoom from './components/createVotingRoom';
import {Route, Routes} from "react-router-dom";
function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/createroom" element={<CreateVotingRoom />} />
      <Route path="/rooms/:id" element={<VotingRoom/>} />
    </Routes>
    </div>

  );
}

export default App;
