// src/pages/EditSample.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LayoutDashboard, PlusCircle, Search, Edit3, ChevronRight } from "lucide-react";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";

const diveSites = [
  "USAT Liberty",
  "Drop Off",
  "Bunutan",
  "Kubu",
  "Pyramids",
  "Rising Sun",
  "Temple",
  "Siladen",
  "Other"
];

const kingdoms = ["Animalia", "Plantae", "Fungi", "Protista", "Undecided"];

const storageLocations = [
  "Cool Room",
  "Freezer -20°C",
  "Deep Freezer -80°C",
  "SEM Room",
  "Gram Staining Boxes",
];
const projectTypes = ["A", "B"];

/// --- Location Picker for Leaflet ---
function LocationPicker({ setLat, setLng }) {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat.toFixed(6));
      setLng(e.latlng.lng.toFixed(6));
    },
  });
  return null;
}

// --- Cloudinary upload ---
async function uploadToCloudinary(file) {
  const uploadUrl = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  if (!uploadUrl || !uploadPreset) {
    throw new Error("Cloudinary is not configured. Check your .env.");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", uploadPreset);

  const res = await axios.post(uploadUrl, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.secure_url;
}

export default function EditSample() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [selectedKingdomFilter, setSelectedKingdomFilter] = useState("All");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("All");

  // keep startDate & endDate states for compatibility with existing filter logic
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // DateRange picker state
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);
  const [showRangePicker, setShowRangePicker] = useState(false);
  const pickerRef = useRef(null);

  // IMPORTANT: we now select by sampleID (string like "A-1-002")
  const [selectedSampleId, setSelectedSampleId] = useState(null);
  const [editingSample, setEditingSample] = useState(null);

  // Form state (mirrors AddSample)
  const [sampleIDDisplay, setSampleIDDisplay] = useState(""); // readonly display
  const [samplePhotoUrl, setSamplePhotoUrl] = useState(null); // existing URL or preview
  const [samplePhotoFile, setSamplePhotoFile] = useState(null); // new file object

  const [sampleType, setSampleType] = useState("Biological");
  const [sampleName, setSampleName] = useState("");
  const [projectType, setProjectType] = useState("A");
  const [projectNumber, setProjectNumber] = useState("");
  const [sampleNumber, setSampleNumber] = useState("");
  const [diveSite, setDiveSite] = useState("");
  const [collectorName, setCollectorName] = useState("");
  const [storageLocation, setStorageLocation] = useState(storageLocations[0]);

  const [species, setSpecies] = useState("");
  const [genus, setGenus] = useState("");
  const [family, setFamily] = useState("");
  const [kingdom, setKingdom] = useState("Undecided");
  const [collectionDate, setCollectionDate] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // Morphology (arrays)
  const [semFiles, setSemFiles] = useState([]); // new File objects
  const [semPreviews, setSemPreviews] = useState([]); // previews for new files
  const [existingSemUrls, setExistingSemUrls] = useState([]); // already-saved URLs

  const [microscopeFiles, setMicroscopeFiles] = useState([]);
  const [microscopePreviews, setMicroscopePreviews] = useState([]);
  const [existingMicroscopeUrls, setExistingMicroscopeUrls] = useState([]);

  // Microbiology
  const [petriFile, setPetriFile] = useState(null);
  const [petriPreview, setPetriPreview] = useState(null);
  const [existingPetriUrls, setExistingPetriUrls] = useState([]); // array or single

  const [isolatedDescription, setIsolatedDescription] = useState("");
  const [isolatedProfile, setIsolatedProfile] = useState("");

  const [gramFile, setGramFile] = useState(null);
  const [gramPreview, setGramPreview] = useState(null);
  const [existingGramUrl, setExistingGramUrl] = useState(null);

  // Molecular
  const [phyloFile, setPhyloFile] = useState(null);
  const [phyloPreview, setPhyloPreview] = useState(null);
  const [existingPhyloUrl, setExistingPhyloUrl] = useState(null);
  const [phyloDescription, setPhyloDescription] = useState("");

  // UI
  const [uploading, setUploading] = useState(false);

  // Fetch samples once
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const res = await axios.get(
          "https://merobase-backendv2-production-2013.up.railway.app/api/samples"
        );
        setSamples(res.data);
      } catch (err) {
        console.error("Failed to fetch samples:", err);
        alert("Failed to fetch samples from backend");
      } finally {
        setLoading(false);
      }
    };
    fetchSamples();
  }, []);

  // Click outside to close date picker
  useEffect(() => {
    function onDocClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowRangePicker(false);
      }
    }
    if (showRangePicker) {
      document.addEventListener("mousedown", onDocClick);
    }
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showRangePicker]);

  // Keep startDate / endDate strings in sync with dateRange selection
  useEffect(() => {
    const sel = dateRange[0];
    if (sel && sel.startDate && sel.endDate) {
      setStartDate(format(sel.startDate, "yyyy-MM-dd"));
      setEndDate(format(sel.endDate, "yyyy-MM-dd"));
    } else {
      setStartDate("");
      setEndDate("");
    }
  }, [dateRange]);

  // Filters (same logic as your EditSample)
  const filteredSamples = samples.filter((sample) => {
    const q = searchText.trim().toLowerCase();
    const textMatch =
      (!q ||
        (sample.sampleName?.toLowerCase() || "").includes(q) ||
        (sample.species?.toLowerCase() || "").includes(q) ||
        (sample.genus?.toLowerCase() || "").includes(q)
      );

    const kingdomMatch = selectedKingdomFilter === "All" || sample.kingdom === selectedKingdomFilter;
    const projectMatch = selectedProjectFilter === "All" || sample.projectType === selectedProjectFilter;

    let dateMatch = true;
    const sampleDate = sample.collectionDate ? new Date(sample.collectionDate) : sample.lastEdited ? new Date(sample.lastEdited) : null;
    if (sampleDate && startDate && endDate) {
      dateMatch = sampleDate >= new Date(startDate) && sampleDate <= new Date(endDate);
    }

    return textMatch && kingdomMatch && projectMatch && dateMatch;
  });

  // Helpers to handle file previews (single and multiple)
  useEffect(() => {
    return () => {
      // cleanup previews
      semPreviews.forEach((p) => URL.revokeObjectURL(p));
      microscopePreviews.forEach((p) => URL.revokeObjectURL(p));
      petriPreview && URL.revokeObjectURL(petriPreview);
      gramPreview && URL.revokeObjectURL(gramPreview);
      phyloPreview && URL.revokeObjectURL(phyloPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMultipleFiles = (e, setFiles, setPreviews) => {
    const files = Array.from(e.target.files || []);
    setFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSinglePreview = (files, setFile, setPreview) => {
    if (files && files[0]) {
      setFile(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  // When user picks a sample from the list, we store sample.sampleID here (not _id)
  // and pre-fill the form with the sample's data.
  useEffect(() => {
    if (!selectedSampleId) {
      setEditingSample(null);
      // keep existing values cleared intentionally
      return;
    }

    // find sample by sampleID (not mongo _id)
    const s = samples.find((x) => x.sampleID === selectedSampleId || x.sampleID === selectedSampleId);
    if (!s) return;

    setEditingSample(s);
    setSampleIDDisplay(s.sampleID || "");
    setSampleType(s.sampleType || "Biological");

    // main sample photo (might be undefined)
    setSamplePhotoUrl(s.samplePhoto || null);
    setSamplePhotoFile(null);

    // basic fields
    setSampleName(s.sampleName || "");

    // Project Number: support multiple naming conventions and coerce to string for controlled input
    const projectNum =
      s.projectNumber ??
      s.project_number ??
      s.projectNo ??
      s.projectNo ??
      (s.project && (s.project.number ?? s.project.no)) ??
      "";
    setProjectNumber(projectNum !== null && projectNum !== undefined ? String(projectNum) : "");

    // Sample Number: support multiple naming conventions and coerce to string
    const sampNum =
      s.sampleNumber ??
      s.sample_number ??
      s.sampleNo ??
      s.sample_no ??
      (s.sample && (s.sample.number ?? s.sample.no)) ??
      "";
    setSampleNumber(sampNum !== null && sampNum !== undefined ? String(sampNum) : "");

    setProjectType(s.projectType || "A");

    // Dive site: support several keys (diveSite, dive_site, site)
    const dSite = s.diveSite ?? s.dive_site ?? s.site ?? s.locationName ?? s.location ?? "";
    setDiveSite(dSite || "");

    setCollectorName(s.collectorName || "");
    setStorageLocation(s.storageLocation || storageLocations[0]);

    // biological
    setSpecies(s.species || "");
    setGenus(s.genus || "");
    setFamily(s.family || "");
    setKingdom(s.kingdom || "Undecided");
    setCollectionDate(s.collectionDate ? s.collectionDate.split("T")[0] : "");
    // lat/lng as strings for controlled inputs / map display
    setLat(s.latitude != null ? String(s.latitude) : "");
    setLng(s.longitude != null ? String(s.longitude) : "");

    // morphology (arrays) — support both semPhotos/morphology.semPhotos OR older semPhoto names
    setExistingSemUrls(
      (s.morphology?.semPhotos && s.morphology.semPhotos.slice()) ||
      (s.semPhotos ? (Array.isArray(s.semPhotos) ? s.semPhotos.slice() : [s.semPhotos]) : [])
    );
    setSemFiles([]);
    setSemPreviews([]);

    setExistingMicroscopeUrls(
      (s.morphology?.microscopePhotos && s.morphology.microscopePhotos.slice()) ||
      (s.microscopePhotos ? (Array.isArray(s.microscopePhotos) ? s.microscopePhotos.slice() : [s.microscopePhotos]) : [])
    );
    setMicroscopeFiles([]);
    setMicroscopePreviews([]);

    // microbiology
    setExistingPetriUrls(
      (s.microbiology?.petriDishPhotos && s.microbiology.petriDishPhotos.slice()) ||
      (s.microbiology?.petriPhoto ? [s.microbiology.petriPhoto] :
        (s.petriPhoto ? (Array.isArray(s.petriPhoto) ? s.petriPhoto.slice() : [s.petriPhoto]) : []))
    );
    setPetriFile(null);
    setPetriPreview(null);

    setIsolatedDescription(s.microbiology?.isolatedDescription || s.isolatedDescription || "");
    setIsolatedProfile(s.microbiology?.isolatedProfile || s.isolatedProfile || "");

    setExistingGramUrl(s.microbiology?.gramStainingPhoto || s.microbiology?.gramPhoto || s.gramPhoto || null);
    setGramFile(null);
    setGramPreview(null);

    // molecular
    setExistingPhyloUrl(s.molecular?.phyloTreePhoto || s.molecular?.phyloPhoto || s.phyloPhoto || null);
    setPhyloFile(null);
    setPhyloPreview(null);
    setPhyloDescription(s.molecular?.phyloTreeDescription || s.molecular?.phyloDescription || s.phyloDescription || "");

  }, [selectedSampleId, samples]);

  // If sampleType toggled to non-biological, clear bio fields
  useEffect(() => {
    if (sampleType === "Non-Biological") {
      setSpecies(""); setGenus(""); setFamily(""); setKingdom("Undecided"); setCollectionDate(""); setLat(""); setLng("");
    }
  }, [sampleType]);

  // Build upload helper for edit: upload only new files, and preserve existing URLs
  async function uploadEditedFiles() {
    const out = {
      morphology: {
        semPhotos: existingSemUrls.slice(), // start with existing
        microscopePhotos: existingMicroscopeUrls.slice(),
      },
      microbiology: {
        petriDishPhotos: existingPetriUrls.slice(),
        gramStainingPhoto: existingGramUrl || "",
        isolatedDescription,
        isolatedProfile,
      },
      molecular: {
        phyloTreePhoto: existingPhyloUrl || "",
        phyloTreeDescription: phyloDescription || "",
      },
      samplePhoto: samplePhotoUrl || "",
    };

    // sample photo (single)
    if (samplePhotoFile) {
      const url = await uploadToCloudinary(samplePhotoFile);
      out.samplePhoto = url;
    }

    // semFiles (multiple) — append newly uploaded URLs
    if (semFiles.length > 0) {
      const urls = await Promise.all(semFiles.map((f) => uploadToCloudinary(f)));
      out.morphology.semPhotos = out.morphology.semPhotos.concat(urls);
    }

    // microscope files
    if (microscopeFiles.length > 0) {
      const urls = await Promise.all(microscopeFiles.map((f) => uploadToCloudinary(f)));
      out.morphology.microscopePhotos = out.morphology.microscopePhotos.concat(urls);
    }

    // petri
    if (petriFile) {
      const url = await uploadToCloudinary(petriFile);
      // append into petriDishPhotos array (backend update expects petriDishPhotos)
      out.microbiology.petriDishPhotos = out.microbiology.petriDishPhotos.concat(url);
    }

    // gram
    if (gramFile) {
      const url = await uploadToCloudinary(gramFile);
      out.microbiology.gramStainingPhoto = url;
    }

    // phylo
    if (phyloFile) {
      const url = await uploadToCloudinary(phyloFile);
      out.molecular.phyloTreePhoto = url;
    }

    // ensure fields exist (strings or arrays) to avoid backend mapping problems
    if (!Array.isArray(out.morphology.semPhotos)) out.morphology.semPhotos = [];
    if (!Array.isArray(out.morphology.microscopePhotos)) out.morphology.microscopePhotos = [];
    if (!Array.isArray(out.microbiology.petriDishPhotos)) out.microbiology.petriDishPhotos = [];

    return out;
  }

  // Save (PUT) — uses sampleID in URL (not Mongo _id)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingSample) return alert("No sample selected to update.");

    // Basic validation (same as AddSample)
    if (sampleType === "Biological" && (!species || !collectionDate || !diveSite || !lat || !lng)) {
      alert("Please fill required Biological fields and select location on map.");
      return;
    }

    try {
      setUploading(true);

      // upload changed files and get URLs + preserve existing
      const uploaded = await uploadEditedFiles();

      // Build payload consistent with both earlier POST and your backend update mapping
      // We will include both sets of keys to maximize compatibility
      const payload = {
        sampleID: editingSample.sampleID, // ensure it stays
        sampleType,
        samplePhoto: uploaded.samplePhoto,
        sampleName,
        projectType,
        projectNumber: projectNumber ? Number(projectNumber) : undefined,
        sampleNumber: sampleNumber ? Number(sampleNumber) : undefined,
        diveSite,
        collectorName,
        storageLocation,

        // Biological fields
        species: sampleType === "Biological" ? species : undefined,
        genus: sampleType === "Biological" ? genus : undefined,
        family: sampleType === "Biological" ? family : undefined,
        kingdom: sampleType === "Biological" ? kingdom : undefined,
        collectionDate: sampleType === "Biological" ? (collectionDate ? new Date(collectionDate) : undefined) : undefined,
        latitude: lat ? parseFloat(lat) : undefined,
        longitude: lng ? parseFloat(lng) : undefined,

        // morphology (match schema names)
        morphology: {
          semPhotos: uploaded.morphology.semPhotos,
          microscopePhotos: uploaded.morphology.microscopePhotos,
        },

        // also include legacy top-level names (if any)
        semPhotos: uploaded.morphology.semPhotos,
        microscopePhotos: uploaded.morphology.microscopePhotos,

        // microbiology — include both petriDishPhotos and petriPhoto for compatibility
        microbiology: {
          petriDishPhotos: uploaded.microbiology.petriDishPhotos,
          isolatedDescription: uploaded.microbiology.isolatedDescription,
          isolatedProfile: uploaded.microbiology.isolatedProfile,
          gramStainingPhoto: uploaded.microbiology.gramStainingPhoto || "",
        },
        // compatibility
        petriPhoto: uploaded.microbiology.petriDishPhotos.length ? uploaded.microbiology.petriDishPhotos[uploaded.microbiology.petriDishPhotos.length - 1] : null,
        gramPhoto: uploaded.microbiology.gramStainingPhoto,

        // molecular
        molecular: {
          phyloTreePhoto: uploaded.molecular.phyloTreePhoto,
          phyloTreeDescription: uploaded.molecular.phyloTreeDescription,
        },
        phyloPhoto: uploaded.molecular.phyloTreePhoto,
        phyloDescription: uploaded.molecular.phyloTreeDescription,

        lastEdited: new Date(),
      };

      // Use sample.sampleID in URL (this fixes the 404 you saw)
      const putUrl = `https://merobase-backendv2-production-2013.up.railway.app/api/samples/${encodeURIComponent(editingSample.sampleID)}`;

      const res = await axios.put(putUrl, payload, { headers: { "Content-Type": "application/json" } });

      // Update local UI array with returned document if any, else merge updated fields
      const returned = res?.data;
      setSamples((prev) => {
        // replace matching sample by sampleID
        return prev.map((p) => (p.sampleID === editingSample.sampleID ? (returned || { ...p, ...payload }) : p));
      });

      alert(`Sample ${editingSample.sampleID} updated successfully.`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to update sample:", err);
      // show helpful error
      const msg = err?.response?.data?.message || err?.message || "Unknown error";
      alert(`Failed to update sample on backend: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading samples...</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`fixed top-0 left-0 h-screen bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? "w-56" : "w-16"} flex flex-col items-start`}
      >
        <div className="flex items-center space-x-2 p-4 w-full">
          <ChevronRight className={`transition-transform duration-300 ${sidebarOpen ? "rotate-90" : ""}`} />
          {sidebarOpen && <h1 className="text-lg font-bold text-gray-700">MEROBase</h1>}
        </div>

        <nav className="flex flex-col mt-4 w-full">
          <button onClick={() => navigate("/dashboard")} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-blue-50 transition rounded-lg">
            <LayoutDashboard className="text-blue-600" />
            {sidebarOpen && <span className="text-gray-700">Dashboard</span>}
          </button>

          <button onClick={() => navigate("/addsample")} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-green-50 transition rounded-lg">
            <PlusCircle className="text-green-600" />
            {sidebarOpen && <span className="text-gray-700">Add Sample</span>}
          </button>

          <button onClick={() => navigate("/editsample")} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-yellow-50 transition rounded-lg">
            <Edit3 className="text-yellow-600" />
            {sidebarOpen && <span className="text-gray-700">Edit Sample</span>}
          </button>

          <button onClick={() => navigate("/searchsample")} className="flex items-center space-x-3 w-full px-4 py-3 hover:bg-purple-50 transition rounded-lg">
            <Search className="text-purple-600" />
            {sidebarOpen && <span className="text-gray-700">Search Sample</span>}
          </button>
        </nav>
      </div>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 p-6 ${sidebarOpen ? "ml-56" : "ml-16"}`}>
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Edit Sample</h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6 max-w-5xl mx-auto">
          {/* Search & Filters */}
          <input type="text" placeholder="Search sample name, species, genus..." value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-center">
            <select value={selectedKingdomFilter} onChange={(e) => setSelectedKingdomFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="All">All</option>
              {kingdoms.map((k) => (<option key={k} value={k}>{k}</option>))}
            </select>

            <select value={selectedProjectFilter} onChange={(e) => setSelectedProjectFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
              <option value="All">All</option>
              {projectTypes.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>

            {/* SINGLE Date Range box */}
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setShowRangePicker((s) => !s)}
                className="w-full text-left px-4 py-2 border rounded-lg flex items-center justify-between"
              >
                <span className="text-sm">
                  {startDate && endDate ? `${format(new Date(startDate), "dd MMM yyyy")} — ${format(new Date(endDate), "dd MMM yyyy")}` : "Select date range"}
                </span>
                <span className="text-xs text-gray-500">{showRangePicker ? "Close" : "Open"}</span>
              </button>

              {showRangePicker && (
                <div className="absolute z-50 mt-2 p-2 bg-white rounded shadow-lg">
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => {
                      // item.selection is the object with startDate/endDate
                      const sel = item.selection;
                      setDateRange([sel]);
                      // keep picker open so user can adjust; clicking outside will close
                    }}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    months={1}
                    direction="horizontal"
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        // clear selection
                        setDateRange([{ startDate: null, endDate: null, key: "selection" }]);
                        setShowRangePicker(false);
                      }}
                      className="px-3 py-1 border rounded"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRangePicker(false)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Keep a hidden small display field for endDate if you ever need it (not visible) */}
            <input type="hidden" value={startDate} readOnly />
            <input type="hidden" value={endDate} readOnly />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {filteredSamples.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">No samples match your filters.</p>
            ) : (
              filteredSamples.map((s) => (
                <div key={s.sampleID || s._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                  <h2 className="font-semibold text-lg">{s.sampleName || s.species || "Unnamed Sample"}</h2>
                  <p className="text-gray-600 text-sm">Project: {s.projectType} #{s.projectNumber ?? s.project_number ?? "-"}</p>
                  <p className="text-gray-600 text-sm">Sample #: {s.sampleNumber ?? s.sample_number ?? "-"}</p>
                  <p className="text-gray-600 text-sm mb-3">Collected: {s.collectionDate ? new Date(s.collectionDate).toLocaleDateString() : s.lastEdited ? new Date(s.lastEdited).toLocaleDateString() : "-"}</p>

                  <div className="flex gap-2">
                    <button onClick={() => setSelectedSampleId(s.sampleID)} className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm">Edit Sample</button>
                    <button onClick={() => navigate(`/sampledetails/${s._id}`, { state: { sample: s } })} className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">View Details</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Editing form: mirrors AddSample layout (option A: sample photo top) */}
          {editingSample && (
            <div className="bg-white p-6 rounded-xl shadow-md mt-6">
              <h2 className="text-xl font-semibold mb-4">Editing: {editingSample.sampleName || editingSample.species}</h2>

              <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
                {/* SAMPLE PHOTO (top) */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Sample Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => { handleSinglePreview(e.target.files, setSamplePhotoFile, setSamplePhotoUrl); }} />
                  {samplePhotoUrl && <img src={samplePhotoUrl} alt="sample" className="mt-2 w-full h-40 object-cover rounded" />}
                </div>

                {/* Sample ID display (readonly) */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Sample ID</label>
                  <input type="text" value={sampleIDDisplay} readOnly className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
                </div>

                {/* Common fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Sample Name</label>
                    <input value={sampleName} onChange={(e) => setSampleName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                  </div>

                  <div>
                    <label className="block mb-1">Project Type</label>
                    <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                      {projectTypes.map((p) => (<option key={p} value={p}>{p}</option>))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Project Number</label>
                    <input type="number" value={projectNumber} onChange={(e) => setProjectNumber(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block mb-1">Sample Number</label>
                    <input type="number" value={sampleNumber} onChange={(e) => setSampleNumber(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block mb-1">Dive Site</label>
                    <select value={diveSite} onChange={(e) => setDiveSite(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                      <option value="">Select</option>
                      {diveSites.map((d) => (<option key={d} value={d}>{d}</option>))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">Collector Name</label>
                    <input value={collectorName} onChange={(e) => setCollectorName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                  </div>

                  <div>
                    <label className="block mb-1">Storage Location</label>
                    <select value={storageLocation} onChange={(e) => setStorageLocation(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                      {storageLocations.map((loc) => (<option key={loc} value={loc}>{loc}</option>))}
                    </select>
                  </div>
                </div>

                {/* Biological fields (same as AddSample) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Sample Type</label>
                    <select value={sampleType} onChange={(e) => setSampleType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                      <option value="Biological">Biological</option>
                      <option value="Non-Biological">Non-Biological</option>
                    </select>
                  </div>

                  {sampleType === "Biological" && (
                    <>
                      <div>
                        <label className="block mb-1">Species</label>
                        <input value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                      </div>

                      <div>
                        <label className="block mb-1">Genus</label>
                        <input value={genus} onChange={(e) => setGenus(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                      </div>

                      <div>
                        <label className="block mb-1">Family</label>
                        <input value={family} onChange={(e) => setFamily(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                      </div>

                      <div>
                        <label className="block mb-1">Kingdom</label>
                        <select value={kingdom} onChange={(e) => setKingdom(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                          {kingdoms.map((k) => (<option key={k} value={k}>{k}</option>))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1">Collection Date</label>
                        <input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block mb-1">Sampling Location</label>
                        <MapContainer center={lat && lng ? [Number(lat), Number(lng)] : [-8.65, 115.2167]} zoom={10} scrollWheelZoom className="w-full h-72 rounded-lg mb-2">
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          {lat && lng && <Marker position={[Number(lat), Number(lng)]} />}
                          <LocationPicker setLat={setLat} setLng={setLng} />
                        </MapContainer>
                        <p className="text-gray-600 text-sm">Latitude: {lat || "-"} — Longitude: {lng || "-"}</p>
                      </div>
                    </>
                  )}
                </div>

                {/* MORPHOLOGY */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Morphology</h3>

                  <label className="block mb-1">SEM Photos (Multiple)</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleMultipleFiles(e, setSemFiles, setSemPreviews)} className="mb-2" />
                  <div className="flex flex-wrap gap-2">
                    {/* existing saved URLs */}
                    {existingSemUrls.map((u, i) => <img key={`sem-ex-${i}`} src={u} className="w-24 h-24 object-cover rounded" />)}
                    {/* new previews */}
                    {semPreviews.map((src, i) => <img key={`sem-pre-${i}`} src={src} className="w-24 h-24 object-cover rounded" />)}
                  </div>

                  <label className="block mt-4 mb-1">Microscope Photos (Multiple)</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => handleMultipleFiles(e, setMicroscopeFiles, setMicroscopePreviews)} />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {existingMicroscopeUrls.map((u, i) => <img key={`mic-ex-${i}`} src={u} className="w-24 h-24 object-cover rounded" />)}
                    {microscopePreviews.map((src, i) => <img key={`mic-pre-${i}`} src={src} className="w-24 h-24 object-cover rounded" />)}
                  </div>
                </div>

                {/* MICROBIOLOGY */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Microbiology</h3>

                  <label className="block mb-1">Petri Dish Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleSinglePreview(e.target.files, setPetriFile, setPetriPreview)} />
                  <div className="flex gap-2 mt-2">
                    {existingPetriUrls.map((u, i) => <img key={`petri-ex-${i}`} src={u} className="w-24 h-24 rounded object-cover" />)}
                    {petriPreview && <img src={petriPreview} className="w-24 h-24 rounded object-cover" />}
                  </div>

                  <label className="block mt-3 mb-1">Gram Staining Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleSinglePreview(e.target.files, setGramFile, setGramPreview)} />
                  <div className="flex gap-2 mt-2">
                    {existingGramUrl && <img src={existingGramUrl} className="w-24 h-24 rounded object-cover" />}
                    {gramPreview && <img src={gramPreview} className="w-24 h-24 rounded object-cover" />}
                  </div>

                  <label className="block mt-4 mb-1">Isolated Description</label>
                  <textarea value={isolatedDescription} onChange={(e) => setIsolatedDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />

                  <label className="block mt-2 mb-1">Isolated Profile</label>
                  <textarea value={isolatedProfile} onChange={(e) => setIsolatedProfile(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                {/* MOLECULAR */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Molecular</h3>

                  <label className="block mb-1">Phylogenetic Tree / Result Photo</label>
                  <input type="file" accept="image/*" onChange={(e) => handleSinglePreview(e.target.files, setPhyloFile, setPhyloPreview)} />
                  <div className="flex gap-2 mt-2">
                    {existingPhyloUrl && <img src={existingPhyloUrl} className="w-28 h-28 rounded object-cover" />}
                    {phyloPreview && <img src={phyloPreview} className="w-28 h-28 rounded object-cover" />}
                  </div>

                  <label className="block mt-3 mb-1">Phylogenetic Description</label>
                  <textarea value={phyloDescription} onChange={(e) => setPhyloDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                </div>

                <button disabled={uploading} type="submit" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60">
                  {uploading ? "Uploading & Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
