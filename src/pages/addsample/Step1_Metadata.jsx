// src/pages/addsample/Step1_Metadata.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Step1_Metadata({ wizardData = {}, setWizardData = () => {} }) {
  const navigate = useNavigate();
  const metadata = wizardData.metadata || {};

  const [localData, setLocalData] = useState({
    samplePhoto: metadata.samplePhoto || null,
    sampleType: metadata.sampleType || "Biological",
    sampleName: metadata.sampleName || "",
    sampleNumber: metadata.sampleNumber || "",
    sampleLength: metadata.sampleLength || "",
    diveSite: metadata.diveSite || "",
    depth: metadata.depth || "",
    temperature: metadata.temperature || "",
    substrate: metadata.substrate || "",
    projectType: metadata.projectType || "A",
    projectNumber: metadata.projectNumber || "",
    collectorName: metadata.collectorName || "",
    kingdom: metadata.kingdom || "Undecided",
    genus: metadata.genus || "",
    family: metadata.family || "",
    species: metadata.species || "",
    storageLocation: metadata.storageLocation || "Cool Room",
    latitude: metadata.latitude || "",
    longitude: metadata.longitude || "",
  });

  const tulambenSites = ["USAT Liberty", "Tulamben Drop Off", "Kubu Wall", "Pyramids", "Batu Kelebit"];
  const substrateOptions = ["Sand", "Rock", "Coral", "Mud", "Other"];

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    setWizardData(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleChange("samplePhoto", URL.createObjectURL(file));
  };

  const LocationMarker = () => {
    const [position, setPosition] = useState(
      localData.latitude && localData.longitude
        ? [localData.latitude, localData.longitude]
        : null
    );

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        handleChange("latitude", lat);
        handleChange("longitude", lng);
      },
    });

    return position ? <Marker position={position}></Marker> : null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4">
          Step 1: Metadata
        </h2>

        {/* Sample Photo */}
        <div className="flex flex-col items-center space-y-2">
          <label className="text-gray-700 font-medium">Sample Photo</label>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="samplePhoto"
            />
            <label htmlFor="samplePhoto" className="cursor-pointer text-gray-500">
              {localData.samplePhoto ? "Change Photo" : "Drag & drop or click to upload"}
            </label>
            {localData.samplePhoto && (
              <img
                src={localData.samplePhoto}
                alt="Sample"
                className="mt-4 w-48 h-48 object-cover rounded-lg shadow-md"
              />
            )}
          </div>
        </div>

        {/* General Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sample Type */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Sample Type</label>
            <select
              value={localData.sampleType}
              onChange={e => handleChange("sampleType", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Biological">Biological</option>
              <option value="Non-Biological">Non-Biological</option>
            </select>
          </div>

          {/* Sample Name */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Sample Name</label>
            <input
              type="text"
              value={localData.sampleName}
              onChange={e => handleChange("sampleName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Sample Number */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Sample Number</label>
            <input
              type="text"
              value={localData.sampleNumber}
              onChange={e => handleChange("sampleNumber", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Sample Length */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Sample Length (cm)</label>
            <input
              type="number"
              value={localData.sampleLength}
              onChange={e => handleChange("sampleLength", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Dive Site */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Dive Site</label>
            <select
              value={localData.diveSite}
              onChange={e => handleChange("diveSite", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Dive Site</option>
              {tulambenSites.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
          </div>

          {/* Depth */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Depth (m)</label>
            <input
              type="number"
              value={localData.depth}
              onChange={e => handleChange("depth", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Temperature */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Temperature (°C)</label>
            <input
              type="number"
              value={localData.temperature}
              onChange={e => handleChange("temperature", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Substrate */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Substrate</label>
            <select
              value={localData.substrate}
              onChange={e => handleChange("substrate", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Substrate</option>
              {substrateOptions.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Project Type */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Project Type</label>
            <select
              value={localData.projectType}
              onChange={e => handleChange("projectType", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="A">A</option>
              <option value="B">B</option>
            </select>
          </div>

          {/* Project Number */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Project Number</label>
            <input
              type="text"
              value={localData.projectNumber}
              onChange={e => handleChange("projectNumber", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Collector Name */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">Collector Name</label>
            <input
              type="text"
              value={localData.collectorName}
              onChange={e => handleChange("collectorName", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Biological Fields */}
        {localData.sampleType === "Biological" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
            <div>
              <label className="block font-medium text-gray-600 mb-1">Kingdom</label>
              <select
                value={localData.kingdom}
                onChange={e => handleChange("kingdom", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="Undecided">Undecided</option>
                <option value="Animalia">Animalia</option>
                <option value="Plantae">Plantae</option>
                <option value="Fungi">Fungi</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-600 mb-1">Genus</label>
              <input
                type="text"
                value={localData.genus}
                onChange={e => handleChange("genus", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600 mb-1">Family</label>
              <input
                type="text"
                value={localData.family}
                onChange={e => handleChange("family", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-600 mb-1">Species</label>
              <input
                type="text"
                value={localData.species}
                onChange={e => handleChange("species", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        )}

        {/* Storage Location */}
        <div>
          <label className="block font-medium text-gray-600 mb-1">Storage Location</label>
          <select
            value={localData.storageLocation}
            onChange={e => handleChange("storageLocation", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Cool Room">Cool Room</option>
            <option value="Freezer">Freezer</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Room Temperature">Room Temperature</option>
          </select>
        </div>

        {/* Map */}
        <div className="h-64 w-full rounded-lg overflow-hidden shadow-md">
          <MapContainer center={[-8.342, 115.544]} zoom={13} className="w-full h-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
          </MapContainer>
        </div>

        {/* Latitude & Longitude */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-600 mb-1">Latitude</label>
            <input
              type="number"
              value={localData.latitude}
              onChange={e => handleChange("latitude", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-600 mb-1">Longitude</label>
            <input
              type="number"
              value={localData.longitude}
              onChange={e => handleChange("longitude", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
