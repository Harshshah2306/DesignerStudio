import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./Login_Folder/SignIn";
import SignUp from "./Login_Folder/SignUp";
import WorkFlowScreen from './WorkFlowScreen/workflowScreen';
import DynaScreen from './Dynascreen/dynascreen';
import HomeScreen from './HomeScreen/HomeScreen';


const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/workFlowScreen" element={<WorkFlowScreen />} />
          <Route path="/homeScreen" element={<HomeScreen/>} />
          <Route path='/dynaScreen' element={<DynaScreen/>} />
        </Routes>
      </Router>
  );
};

export default App;
