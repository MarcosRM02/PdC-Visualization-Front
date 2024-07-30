import { Routes, Route } from 'react-router-dom';
import Home from './Services/Read/Home';
import ShowExperiments from './Services/Read/ShowExperiments';
import ShowParticipants from './Services/Read/ShowParticipants';
import ShowTrials from './Services/Read/ShowTrials';
import CreateUser from './Services/Create/CreateUser';
import EditUser from './Services/Update/EditUser';
import DeleteUser from './Services/Delete/DeleteUser';
import CreateExperiment from './Services/Create/CreateExperiment';
import EditExperiment from './Services/Update/EditExperiment';
import DeleteExperiment from './Services/Delete/DeleteExperiment';
import CreateParticipant from './Services/Create/CreateParticipant';
import EditParticipant from './Services/Update/EditParticipant';
import DeleteParticipant from './Services/Delete/DeleteParticipant';
import EditPersonalData from './Services/Update/EditPersonalData';
import DeletePersonalData from './Services/Delete/DeletePersonalData';
import CreateTrial from './Services/Create/CreateTrial';
import Login from './Services/Login/login';
import EditTrial from './Services/Update/EditTrial';
import DeleteTrial from './Services/Delete/DeleteTrial';
import ShowWearables from './Services/Read/ShowWearablesData';

const App = () => {
  console.log(process.env.REACT_APP_API_URL);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/professionals/create" element={<CreateUser />} />
      <Route path="/professionals/edit/:id" element={<EditUser />} />
      <Route path="/professionals/delete/:id" element={<DeleteUser />} />
      <Route path="/" element={<Home />} /> */}

      <Route path="/experiments/create/:id" element={<CreateExperiment />} />
      <Route path="/experiments/edit/:id" element={<EditExperiment />} />
      <Route path="/experiments/delete/:id" element={<DeleteExperiment />} />
      <Route
        path="experiments/by-professional/:id"
        element={<ShowExperiments />}
      />
      <Route path="/participants/create/:id" element={<CreateParticipant />} />
      <Route path="/participants/edit/:id" element={<EditParticipant />} />
      <Route path="/participants/delete/:id" element={<DeleteParticipant />} />

      <Route path="/personalData/edit/:id" element={<EditPersonalData />} />
      <Route path="/personalData/delete/:id" element={<DeletePersonalData />} />
      <Route
        path="/participants/by-experiment/:id"
        element={<ShowParticipants />}
      />

      <Route path="/trials/create/:id" element={<CreateTrial />} />
      <Route path="/trials/edit/:id" element={<EditTrial />} />
      <Route path="/trials/delete/:id" element={<DeleteTrial />} />
      <Route path="/trials/by-participant/:id" element={<ShowTrials />} />

      <Route
        path="/swData/getData/:experimentId/:participantId/:swId/:trialId"
        element={<ShowWearables />}
      />
    </Routes>
  );
};

export default App;
