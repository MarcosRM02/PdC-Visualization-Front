import { Routes, Route } from "react-router-dom";
import Home from "./Services/Home";
import CreateUser from "./Services/CreateUser";
import ShowUser from "./Services/ShowUser";
import EditUser from "./Services/EditUser";
import DeleteUser from "./Services/DeleteUser";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users/:id" element={<ShowUser />} />
      {/* <Route path="/books/create" element={<CreateUser />} />
      <Route path="/books/edit/:id" element={<EditUser />} />
      <Route path="/books/delete/:id" element={<DeleteUser />} /> */}
    </Routes>
  );
};

export default App;
