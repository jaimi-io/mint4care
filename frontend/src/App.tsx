import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserVesting from "./pages/UserVesting";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserVesting />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
