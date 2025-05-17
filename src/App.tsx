import { Routes, Route } from 'react-router-dom';
import ShowExperiments from './Services/Read/ShowExperiments';
import ShowParticipants from './Services/Read/ShowParticipants';
import ShowTrials from './Services/Read/ShowTrials';
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
import PrivateRoute from './PrivateRoute';
import ShowTemplates from './Services/Read/ShowTemplates';
import ShowTrialsTemplates from './Services/Read/ShowTrialsTemplates';
import ShowAllParticipants from './Services/Read/ShowAllParticipants';
import DeleteParticipantTemplateModal from './Services/Delete/DeleteParticipantTemplate';
import AddExistingParticipantsModal from './Services/Create/AddExistingParticipants';
import EditPersonalDataTemplateModal from './Services/Update/EditPersonalDataTemplate';
import CookiePolicy from './Components/CommonComponents/CookiesPolicy';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />
      <Route element={<PrivateRoute />}>
        <Route
          path="experiments/create/:id"
          element={
            <CreateExperiment
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              onCreated={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
        <Route
          path="experiments/edit/:id"
          element={
            <EditExperiment
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              id={-1}
              onEdited={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
        <Route
          path="/experiments/delete/:id"
          element={
            <DeleteExperiment
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              onDeleted={function (): void {
                throw new Error('Function not implemented.');
              }}
              id={-1}
            />
          }
        />
        <Route
          path="experiments/by-professional/:id"
          element={<ShowExperiments />}
        />
        <Route
          path="experiments/by-token/token"
          element={<ShowExperiments />}
        />

        <Route
          path="/participants/create/:id"
          element={
            <CreateParticipant
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              onCreated={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
        <Route
          path="participants/edit/:id"
          element={
            <EditParticipant
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              id={-1}
              onEdited={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
        <Route
          path="participants/delete/:id"
          element={
            <DeleteParticipant
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              onDeleted={function (): void {
                throw new Error('Function not implemented.');
              }}
              id={-1}
            />
          }
        />

        <Route
          path="personalData/edit/:id"
          element={
            <EditPersonalData
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              id={-1}
              onEdited={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
        <Route
          path="personalData/delete/:id"
          element={<DeletePersonalData />}
        />
        <Route
          path="participants/by-experiment/:id"
          element={<ShowParticipants />}
        />

        <Route
          path="trials/create/:id"
          element={
            <CreateTrial
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              onCreated={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
        <Route
          path="trials/edit/:id"
          element={
            <EditTrial
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              id={-1}
              onEdited={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
        <Route
          path="trials/delete/:id"
          element={
            <DeleteTrial
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              onDeleted={function (): void {
                throw new Error('Function not implemented.');
              }}
              id={-1}
            />
          }
        />
        <Route path="trials/by-participant/:id" element={<ShowTrials />} />

        <Route
          path="swData/getData/:experimentId/:participantId/:swId/:trialId"
          element={<ShowWearables />}
        />
        {/* Nuevas rutas */}
        <Route
          path="templates/by-professional/:id"
          element={<ShowTemplates />}
        />
        <Route
          path="trialTemplates/by-professional/:id"
          element={<ShowTrialsTemplates />}
        />
        <Route
          path="trialTemplates/create/:id"
          element={
            <CreateTrial
              isOpen={false}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
              onCreated={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
        />
        <Route
          path="participantTemplates/by-professional/:id"
          element={<ShowAllParticipants />}
        />
      </Route>

      <Route
        path="participantTemplates/edit/:id"
        element={
          <EditParticipant
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
            id={-1}
            onEdited={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        }
      />
      <Route
        path="participantTemplates/delete/:id"
        element={
          <DeleteParticipantTemplateModal
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
            onDeleted={function (): void {
              throw new Error('Function not implemented.');
            }}
            id={-1}
          />
        }
      />

      <Route
        path="participantTemplates/edit/:id"
        element={
          <EditPersonalData
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
            id={-1}
            onEdited={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        }
      />
      <Route
        path="participantTemplates/delete/:id"
        element={<DeletePersonalData />}
      />

      <Route
        path="trials/create/:id"
        element={
          <AddExistingParticipantsModal
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
            onCreated={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        }
      />
      <Route
        path="personalDataTemplate/edit/:id"
        element={
          <EditPersonalDataTemplateModal
            isOpen={false}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
            id={-1}
            onEdited={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        }
      />
    </Routes>
  );
};

export default App;
