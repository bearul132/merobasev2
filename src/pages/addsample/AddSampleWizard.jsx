import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { SampleFormProvider, useSampleFormContext } from "../../context/SampleFormContext";
import {
  LayoutDashboard,
  PlusCircle,
  Edit3,
  Search,
  ChevronRight,
} from "lucide-react";

/* ================= Wizard Steps ================= */
const steps = [
  { path: "/add/step1", label: "Metadata" },
  { path: "/add/step2", label: "Morphology" },
  { path: "/add/step3", label: "Microbiology" },
  { path: "/add/step4", label: "Molecular" },
  { path: "/add/step5", label: "Publication" },
  { path: "/add/review", label: "Review" },
];

export default function AddSampleWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ================= EDIT MODE DETECTION ================= */
  const isEditMode = location.state?.mode === "edit";
  const editSampleData = location.state?.sample || null;

  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      navigate(steps[currentStepIndex + 1].path, { state: location.state });
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1].path, { state: location.state });
    }
  };

  return (
    <SampleFormProvider>
      <WizardLayout
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isEditMode={isEditMode}
        editSampleData={editSampleData}
        currentStepIndex={currentStepIndex}
        goNext={goNext}
        goBack={goBack}
      >
        <Outlet />
      </WizardLayout>
    </SampleFormProvider>
  );
}

/* ================= Layout Component ================= */
function WizardLayout({
  sidebarOpen,
  setSidebarOpen,
  isEditMode,
  editSampleData,
  currentStepIndex,
  goNext,
  goBack,
  children,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadSampleForEdit } = useSampleFormContext();

  /* ================= Load Edit Sample ================= */
  useEffect(() => {
    if (isEditMode && editSampleData) {
      loadSampleForEdit(editSampleData);
    }
  }, [isEditMode, editSampleData, loadSampleForEdit]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* ================= Sidebar ================= */}
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`h-screen bg-white shadow-xl transition-all duration-300 ${
          sidebarOpen ? "w-56" : "w-16"
        } flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4">
          <ChevronRight className={`transition-transform ${sidebarOpen ? "rotate-90" : ""}`} />
          {sidebarOpen && (
            <h1 className="text-lg font-bold text-gray-700">MEROBase</h1>
          )}
        </div>

        <nav className="flex flex-col mt-4 w-full gap-1">
          <SidebarButton
            icon={<LayoutDashboard className="text-blue-600" />}
            label="Dashboard"
            open={sidebarOpen}
            onClick={() => navigate("/dashboard")}
          />
          <SidebarButton
            icon={<PlusCircle className="text-green-600" />}
            label="Add Sample"
            open={sidebarOpen}
            onClick={() => navigate("/add/step1", { state: { mode: "add" } })}
          />
          <SidebarButton
            icon={<Edit3 className="text-yellow-600" />}
            label="Edit Sample"
            open={sidebarOpen}
            onClick={() => navigate("/editsample")}
          />
          <SidebarButton
            icon={<Search className="text-purple-600" />}
            label="Search Sample"
            open={sidebarOpen}
            onClick={() => navigate("/searchsample")}
          />
        </nav>
      </div>

      {/* ================= Main Content ================= */}
      <div className={`flex-1 p-6 transition-all ${sidebarOpen ? "ml-56" : "ml-16"}`}>
        <div className="mx-auto max-w-4xl bg-white rounded-2xl shadow-lg p-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditMode ? "Edit Sample — Wizard" : "Add Sample — Wizard"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "You are editing an existing sample."
                : "Create a new sample entry (frontend-only)."}
            </p>
          </div>

          {/* Step Navigation */}
          <div className="mb-6 flex flex-wrap gap-3 text-sm text-gray-600 justify-center">
            {steps.map((step, idx) => (
              <NavLink
                key={step.path}
                to={step.path}
                state={{ mode: isEditMode ? "edit" : "add", sample: editSampleData }}
                className={({ isActive }) =>
                  `px-3 py-1 rounded-full transition ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`
                }
              >
                {idx + 1}. {step.label}
              </NavLink>
            ))}
          </div>

          {/* Step Content */}
          <div className="mb-8">{children}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            {currentStepIndex > 0 ? (
              <button
                onClick={goBack}
                className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStepIndex < steps.length - 1 ? (
              <button
                onClick={goNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <span className="text-sm text-gray-500">
                Review & submit handled in Step 6
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Sidebar Button ================= */
function SidebarButton({ icon, label, open, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 transition rounded-lg"
    >
      {icon}
      {open && <span className="text-gray-700 font-medium">{label}</span>}
    </button>
  );
}
