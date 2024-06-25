import { Routes, Route } from "react-router-dom";
import Home from "./Services/Home";
import ShowUser from "./Services/ShowUser";
import ShowSWData from "./Services/ShowSWData";
import ShowWearables from "./Services/ShowWearablesData";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/:id" element={<ShowUser />} />
      <Route path="/swdata/:id" element={<ShowSWData />} />
      <Route path="/swdata/:id/:timestamp" element={<ShowWearables />} />
      {/* <Route path="/books/create" element={<CreateUser />} />
      <Route path="/books/edit/:id" element={<EditUser />} />
      <Route path="/books/delete/:id" element={<DeleteUser />} /> */}
    </Routes>
  );
};

export default App;
