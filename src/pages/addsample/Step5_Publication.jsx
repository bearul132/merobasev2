// src/pages/Step5_Publication.jsx
import React from 'react';
import { useSampleFormContext } from '../../context/SampleFormContext';
import StepNavigation from '../../components/StepNavigation';
import FormProgressBar from '../../components/FormProgressBar';

export default function Step5_Publication() {
  const { formData, updateSection } = useSampleFormContext();

  /* ================= SAFE DEFAULT ================= */
  const pubs = {
    links: [],
    ...formData.publication
  };

  /* ================= HANDLERS ================= */
  const handleLinkChange = (index, value) => {
    const updated = [...pubs.links];
    updated[index] = value;
    updateSection('publication', { links: updated });
  };

  const addLink = () => {
    updateSection('publication', {
      links: [...pubs.links, '']
    });
  };

  const removeLink = (index) => {
    updateSection('publication', {
      links: pubs.links.filter((_, i) => i !== index)
    });
  };

  /* ================= RENDER ================= */
  return (
    <div className="container mx-auto p-4">
      <FormProgressBar step={5} steps={6} />

      <h3 className="text-xl font-semibold mb-6">
        Publication & References
      </h3>

      <div className="grid gap-6">

        {/* ================= PUBLICATION LINKS ================= */}
        <section className="border rounded-lg p-5 bg-gray-50">
          <h4 className="font-medium mb-4">
            Publication Links
          </h4>

          <p className="text-sm text-gray-600 mb-4">
            Add links to journals, preprints, repositories, or related publications
            (e.g. DOI, ResearchGate, institutional repository).
          </p>

          <div className="grid gap-3">
            {pubs.links.map((link, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                <input
                  type="url"
                  placeholder="https://doi.org/..."
                  value={link}
                  onChange={(e) =>
                    handleLinkChange(index, e.target.value)
                  }
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />

                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addLink}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            + Add Publication Link
          </button>
        </section>

        {/* ================= NAVIGATION ================= */}
        <StepNavigation
          backPath="/add/step4"
          nextPath="/add/review"
        />
      </div>
    </div>
  );
}
