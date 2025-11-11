import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Kingdom options
const kingdoms = ["All", "Animalia", "Plantae", "Fungi", "Protista", "Undecided"];

// Project type options
const projectTypes = ["All", "A", "B"];

export default function SearchSample({ samples = [] }) {
  const [searchText, setSearchText] = useState("");
  const [selectedKingdom, setSelectedKingdom] = useState("All");
  const [selectedProjectType, setSelectedProjectType] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredSamples = samples.filter((sample) => {
    // Manual search
    const matchesText =
      (sample.sampleName?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (sample.species?.toLowerCase().includes(searchText.toLowerCase()) ?? false) ||
      (sample.genus?.toLowerCase().includes(searchText.toLowerCase()) ?? false);

    // Kingdom filter
    const matchesKingdom =
      selectedKingdom === "All" || sample.kingdom === selectedKingdom;

    // Project type filter
    const matchesProject =
      selectedProjectType === "All" || sample.projectType === selectedProjectType;

    // Date range filter
    let matchesDate = true;
    const sampleDate = sample.collectionDate
      ? new Date(sample.collectionDate)
      : sample.lastEdited
      ? new Date(sample.lastEdited)
      : null;

    if (sampleDate && startDate && endDate) {
      matchesDate = sampleDate >= startDate && sampleDate <= endDate;
    }

    return matchesText && matchesKingdom && matchesProject && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <h1 className="text-2xl font-bold text-blue-600 mb-6 text-center">
        Search Samples
      </h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search sample name, species, genus..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedKingdom}
            onChange={(e) => setSelectedKingdom(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {kingdoms.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <select
            value={selectedProjectType}
            onChange={(e) => setSelectedProjectType(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {projectTypes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <DatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            placeholderText="Select date range"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Sample List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSamples.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No samples match your search.
          </p>
        )}

        {filteredSamples.map((sample) => (
          <div
            key={sample.id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="font-semibold text-lg mb-1">
              {sample.sampleName || sample.species || "Unnamed Sample"}
            </h2>
            <p className="text-gray-600 text-sm mb-1">
              Project: {sample.projectType} #{sample.projectNumber || "-"}
            </p>
            <p className="text-gray-600 text-sm mb-1">
              Sample #: {sample.sampleNumber || "-"}
            </p>
            <p className="text-gray-600 text-sm mb-2">
              Collected:{" "}
              {sample.collectionDate
                ? new Date(sample.collectionDate).toLocaleDateString()
                : sample.lastEdited
                ? new Date(sample.lastEdited).toLocaleDateString()
                : "-"}
            </p>
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              onClick={() => alert(JSON.stringify(sample, null, 2))}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
