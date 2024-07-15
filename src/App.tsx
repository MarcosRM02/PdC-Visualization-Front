import { Routes, Route } from 'react-router-dom';
import Home from './Services/Read/Home';
import ShowExperiments from './Services/Read/ShowExperiments';
import ShowSWData from './Services/Read/ShowSWData';
import ShowWearables from './Services/Read/ShowWearablesData';
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

const App = () => {
  return (
    <Routes>
      <Route path="/professionals/create" element={<CreateUser />} />
      <Route path="/professionals/edit/:id" element={<EditUser />} />
      <Route path="/professionals/delete/:id" element={<DeleteUser />} />
      <Route path="/" element={<Home />} />

      <Route path="/experiments/create" element={<CreateExperiment />} />
      <Route path="/experiments/edit/:id" element={<EditExperiment />} />
      <Route path="/experiments/delete/:id" element={<DeleteExperiment />} />
      <Route
        path="experiments/by-professional/:id"
        element={<ShowExperiments />}
      />
      <Route path="/participants/create" element={<CreateParticipant />} />
      <Route path="/participants/edit/:id" element={<EditParticipant />} />
      <Route path="/participants/delete/:id" element={<DeleteParticipant />} />
      <Route
        path="/participants/by-experiment/:id"
        element={<ShowParticipants />}
      />
      <Route path="/trials/by-participant/:id" element={<ShowTrials />} />
    </Routes>
  );
};

export default App;
