import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddNewSample from "./pages/AddSample";
import SearchSample from "./pages/SearchSample";
import EditSample from "./pages/EditSample";

// Initial mock data (optional)
const initialSamples = [
  {
    id: "SMP-001",
    sampleType: "Biological",
    sampleName: "Sample 1",
    species: "Acropora sp.",
    genus: "Acropora",
    family: "Acroporidae",
    kingdom: "Animalia",
    projectType: "A",
    projectNumber: 1,
    sampleNumber: 1,
    diveSite: "USAT Liberty",
    collectorName: "Fakhrurrazi",
    collectionDate: "2025-11-01",
    latitude: -8.65,
    longitude: 115.22,
    samplePhoto: null,
    semPhoto: null,
    isolatedPhoto: null,
    lastEdited: new Date(),
  },
];

function App() {
  const [samples, setSamples] = useState(initialSamples);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<Dashboard samples={samples} />}
        />
        <Route
          path="/addsample"
          element={<AddNewSample samples={samples} setSamples={setSamples} />}
        />
        <Route
          path="/searchsample"
          element={<SearchSample samples={samples} />}
        />
        <Route
          path="/editsample"
          element={<EditSample samples={samples} setSamples={setSamples} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
