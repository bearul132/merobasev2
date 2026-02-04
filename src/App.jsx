import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context
import { SampleFormProvider } from "./context/SampleFormContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SearchSample from "./pages/SearchSample";
import EditSample from "./pages/EditSample";
import SampleDetails from "./pages/SampleDetails";

// Wizard
import AddSampleWizard from "./pages/addsample/AddSampleWizard";
import Step1_Metadata from "./pages/addsample/Step1_Metadata";
import Step2_Morphology from "./pages/addsample/Step2_Morphology";
import Step3A_PrimaryIsolated from "./pages/addsample/Step3A_PrimaryIsolated";
import Step3B_IsolatedMorphology from "./pages/addsample/Step3B_IsolatedMorphology";
import Step3C_Misc from "./pages/addsample/Step3C_Misc";
import Step4_Molecular from "./pages/addsample/Step4_Molecular";
import Step5_Publication from "./pages/addsample/Step5_Publication";
import Step6_ReviewSubmit from "./pages/addsample/Step6_ReviewSubmit";

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
    lastEdited: new Date(),
  },
];

export default function App() {
  const [samples, setSamples] = useState(initialSamples);

  return (
    <Router>
      {/* ✅ PROVIDER MUST WRAP ROUTES */}
      <SampleFormProvider>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard samples={samples} />}
          />

          {/* ================= ADD SAMPLE WIZARD ================= */}
          <Route path="/add" element={<AddSampleWizard />}>
            <Route index element={<Navigate to="step1" replace />} />

            <Route path="step1" element={<Step1_Metadata />} />
            <Route path="step2" element={<Step2_Morphology />} />

            {/* ✅ SPLIT MICROBIOLOGY */}
            <Route path="step3a" element={<Step3A_PrimaryIsolated />} />
            <Route path="step3b" element={<Step3B_IsolatedMorphology />} />
            <Route path="step3c" element={<Step3C_Misc />} />

            <Route path="step4" element={<Step4_Molecular />} />
            <Route path="step5" element={<Step5_Publication />} />
            <Route path="review" element={<Step6_ReviewSubmit />} />
          </Route>

          {/* Backward compatibility */}
          <Route
            path="/addsample"
            element={<Navigate to="/add/step1" replace />}
          />

          {/* Search */}
          <Route
            path="/searchsample"
            element={<SearchSample samples={samples} />}
          />

          {/* Edit Sample */}
          <Route
            path="/editsample"
            element={
              <EditSample samples={samples} setSamples={setSamples} />
            }
          />

          {/* Sample Details */}
          <Route
            path="/sampledetails/:id"
            element={<SampleDetails samples={samples} />}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SampleFormProvider>
    </Router>
  );
}
