import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { SampleFormProvider } from '../../context/SampleFormContext';
import { LayoutDashboard, PlusCircle, Edit3, Search, ChevronRight } from 'lucide-react';

const steps = [
  { path: '/add/step1', label: 'Metadata' },
  { path: '/add/step2', label: 'Morphology' },
  { path: '/add/step3', label: 'Microbiology' },
  { path: '/add/step4', label: 'Molecular' },
  { path: '/add/step5', label: 'Publication' },
  { path: '/add/review', label: 'Review' },
];

export default function AddSampleWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentStepIndex = steps.findIndex(s => s.path === location.pathname);

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      navigate(steps[currentStepIndex + 1].path);
    }
  };

  const goBack = () => {
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1].path);
    }
  };

  return (
    <SampleFormProvider>
      <div className="flex min-h-screen font-sans bg-gray-50">
        {/* Sidebar */}
        <div
          onMouseEnter={() => setSidebarOpen(true)}
          onMouseLeave={() => setSidebarOpen(false)}
          className={`h-screen bg-white shadow-xl transition-all duration-300 flex flex-col items-start
            ${sidebarOpen ? 'w-56' : 'w-16'}`}
        >
          <div className="flex items-center space-x-2 p-4">
            <ChevronRight className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-90' : ''}`} />
            {sidebarOpen && <h1 className="text-lg font-bold text-gray-700">MEROBase</h1>}
          </div>

          <nav className="flex flex-col mt-4 w-full">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-blue-50 transition rounded-lg"
            >
              <LayoutDashboard className="text-blue-600" />
              {sidebarOpen && <span className="text-gray-700">Dashboard</span>}
            </button>
            <button
              onClick={() => navigate("/add/step1")}
              className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-green-50 transition rounded-lg"
            >
              <PlusCircle className="text-green-600" />
              {sidebarOpen && <span className="text-gray-700">Add Sample</span>}
            </button>
            <button
              onClick={() => navigate("/editsample")}
              className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-yellow-50 transition rounded-lg"
            >
              <Edit3 className="text-yellow-600" />
              {sidebarOpen && <span className="text-gray-700">Edit Sample</span>}
            </button>
            <button
              onClick={() => navigate("/searchsample")}
              className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-purple-50 transition rounded-lg"
            >
              <Search className="text-purple-600" />
              {sidebarOpen && <span className="text-gray-700">Search Sample</span>}
            </button>
          </nav>
        </div>

        {/* Main Wizard Content */}
        <div className="flex-1 p-6">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 mx-auto">
            {/* Header */}
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold">Add Sample — Wizard</h2>
              <p className="text-sm text-gray-500">
                Card-style wizard. Images stored locally and uploaded on Finish.
              </p>
            </div>

            {/* Step Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2 text-sm text-gray-600 flex-wrap">
                {steps.map((s, idx) => (
                  <React.Fragment key={s.path}>
                    <NavLink
                      to={s.path}
                      className={({ isActive }) => (isActive ? 'font-semibold' : '')}
                    >
                      {idx + 1}.{s.label}
                    </NavLink>
                    {idx < steps.length - 1 && <span>•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-6">
              <Outlet />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              {currentStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Back
                </button>
              ) : (
                <div /> // placeholder to keep spacing
              )}

              {currentStepIndex < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  form="wizardForm"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </SampleFormProvider>
  );
}
