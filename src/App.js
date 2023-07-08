import logo from './logo.svg';
// import './styles/App.scss';
import Homepage from './components/homepage';
import VotingRoom from './components/VotingRoom';
import CreateVotingRoom from './components/createVotingRoom';
import HostDashboard from './components/HostDashboard';
import SignUp from './components/signup';
import Login from './components/login';
import {Route, Routes} from "react-router-dom";
import { Provider } from 'react-redux';
import {store} from "./redux/store.js";


function App() {
  return (
    <Provider store={store}>
    <div className="App">
    <Routes>
      <Route path="/" element={<Homepage/>} />
      <Route path="/createroom" element={<CreateVotingRoom />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/rooms/:id" element={<VotingRoom/>} />
      <Route path="/dashboard/:id" element={<HostDashboard/>} />
    </Routes>
    </div>
    </Provider>
  );
}

export default App;
