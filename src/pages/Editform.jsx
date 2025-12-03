// src/pages/EditForm.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const sample = state?.sample;

  const [formData, setFormData] = useState({
    sampleID: "",
    sampleName: "",
    species: "",
    genus: "",
    family: "",
    kingdom: "",
    projectType: "",
    collectionDate: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(true);

  // Local backend URL (or use environment variable)
  const backendUrl = "http://localhost:5000"; // <-- CHANGE to your local backend

  useEffect(() => {
    if (sample) {
      setFormData({
        sampleID: sample.sampleID || "",
        sampleName: sample.sampleName || "",
        species: sample.species || "",
        genus: sample.genus || "",
        family: sample.family || "",
        kingdom: sample.kingdom || "",
        projectType: sample.projectType || "",
        collectionDate: sample.collectionDate || "",
        latitude: sample.latitude || "",
        longitude: sample.longitude || "",
      });
      setLoading(false);
    }
  }, [sample]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${backendUrl}/api/samples/${sample._id}`,
        formData
      );
      alert("Sample updated successfully!");
      navigate("/editsample");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update sample. Check console.");
    }
  };

  if (loading) return <p>Loading sample data...</p>;

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Edit Sample: {formData.species || formData.sampleName}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sample Name */}
          <div>
            <label className="block font-semibold mb-1">Sample Name</label>
            <input
              type="text"
              name="sampleName"
              value={formData.sampleName}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block font-semibold mb-1">Species</label>
            <input
              type="text"
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>

          {/* Genus & Family */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Genus</label>
              <input
                type="text"
                name="genus"
                value={formData.genus}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Family</label>
              <input
                type="text"
                name="family"
                value={formData.family}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {/* Kingdom & Project Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Kingdom</label>
              <select
                name="kingdom"
                value={formData.kingdom}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="">Select Kingdom</option>
                <option value="Animalia">Animalia</option>
                <option value="Plantae">Plantae</option>
                <option value="Fungi">Fungi</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Project Type</label>
              <input
                type="text"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          {/* Collection Date, Latitude, Longitude */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Collection Date</label>
              <input
                type="date"
                name="collectionDate"
                value={formData.collectionDate}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="0.0001"
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="0.0001"
                className="w-full border rounded p-2"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
