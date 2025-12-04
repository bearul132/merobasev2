// src/pages/AddSample.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LayoutDashboard, PlusCircle, Edit3, Search, ChevronRight } from "lucide-react";

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

// --- Location Picker for Leaflet ---
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

// --- Drag-and-drop component (accepts custom accept prop) ---
function FileDropzone({ multiple = false, files, setFiles, previews, setPreviews, accept = "image/*" }) {
  const inputRef = useRef(null);

  // clean previous previews on unmount/change
  useEffect(() => {
    return () => {
      (previews || []).forEach((p) => p && URL.revokeObjectURL(p));
    };
  }, [previews]);

  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles || []);
    // revoke previous previews
    (previews || []).forEach((p) => p && URL.revokeObjectURL(p));
    setFiles(fileArray);
    setPreviews(fileArray.map((f) => URL.createObjectURL(f)));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current && inputRef.current.click()}
      className="border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer text-center"
    >
      <p>Drag & drop files here, or click to select</p>
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
      <div className="flex flex-wrap mt-2 justify-center gap-2">
        {(files || []).map((f, i) => {
          const isImage = f && f.type && f.type.startsWith && f.type.startsWith("image/");
          const previewUrl = (previews || [])[i];
          return isImage ? (
            <img key={i} src={previewUrl} alt={`preview-${i}`} className="w-20 h-20 rounded object-cover" />
          ) : (
            <div key={i} className="w-40 h-10 rounded border px-2 py-2 flex items-center justify-center text-sm">
              {f.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Main AddNewSample Component ---
export default function AddNewSample({ samples, setSamples }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sampleType, setSampleType] = useState("Biological");

  // --- Sample Info ---
  const [sampleName, setSampleName] = useState("");
  const [projectType, setProjectType] = useState("A");
  const [projectNumber, setProjectNumber] = useState("");
  const [sampleNumber, setSampleNumber] = useState("");
  const [diveSite, setDiveSite] = useState("");
  const [customDiveSite, setCustomDiveSite] = useState("");
  const [collectorName, setCollectorName] = useState("");
  const [storageLocation, setStorageLocation] = useState(storageLocations[0]);

  const [species, setSpecies] = useState("");
  const [genus, setGenus] = useState("");
  const [family, setFamily] = useState("");
  const [kingdom, setKingdom] = useState("Undecided");
  const [collectionDate, setCollectionDate] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  // --- Publication Links ---
  const [publicationLinks, setPublicationLinks] = useState([""]);

  const handleLinkChange = (index, value) => {
    const updated = [...publicationLinks];
    updated[index] = value;
    setPublicationLinks(updated);
  };

  const addPublicationLink = () => {
    setPublicationLinks([...publicationLinks, ""]);
  };

  const removePublicationLink = (index) => {
    const updated = publicationLinks.filter((_, i) => i !== index);
    setPublicationLinks(updated);
  };

  // --- Images ---
  const [samplePhoto, setSamplePhoto] = useState([]);
  const [samplePhotoPreview, setSamplePhotoPreview] = useState([]);

  const [semFiles, setSemFiles] = useState([]);
  const [semPreviews, setSemPreviews] = useState([]);

  const [microscopeFiles, setMicroscopeFiles] = useState([]);
  const [microscopePreviews, setMicroscopePreviews] = useState([]);

  const [petriFile, setPetriFile] = useState([]);
  const [petriPreview, setPetriPreview] = useState([]);

  const [gramFile, setGramFile] = useState([]);
  const [gramPreview, setGramPreview] = useState([]);

  const [phyloFile, setPhyloFile] = useState([]); // phylogenetic photo
  const [phyloPreview, setPhyloPreview] = useState([]);

  // extra molecular uploads
  const [gelFile, setGelFile] = useState([]);
  const [gelPreview, setGelPreview] = useState([]);
  const [seqFiles, setSeqFiles] = useState([]); // sequence files (.fastq .ab1 etc)
  const [seqPreviews, setSeqPreviews] = useState([]);

const [microbiologyState, setMicrobiologyState] = useState({
  isolatedDescription: {
    colonyShape: "None",
    colonyMargin: "None",
    colonyElevation: "None",
    colonyColor: "None",
    colonyTexture: "None",
    microscopicShape: "None",
    microscopicArrangement: "None",
  },
  isolatedProfile: {
    gramReaction: "None",
    motility: "None",
    oxygenRequirement: "None",
    halotolerance: "None",
    temperaturePreference: "None",
    agarMedia: "None",
    antibacterialAssay: {
      pathogen: "",
      method: "",
    },
    incubationTime: "",
    enzymatic: "",
    antimalarialAssay: {
      assayResult: "",      // keep your old string here
      biochemistry: "",    // new dropdown field
    },
    molecularIdentification: {
      sequence: "",
    },
  },
});

  // --- New molecular state ---
  const [molecularState, setMolecularState] = useState({
    dnaSource: "None",
    extractionMethod: "None",
    geneTarget: "None",
    primerSet: "None",
    pcrPlatform: "None",
    pcrProtocol: "None",
    sequencingMethod: "None",
    sequencingVendor: "None",
    sequenceQuality: "None",
    bioinformaticsPipeline: "None",
    accessionType: "None",
    dnaConcentrationRange: "None",
  });

  const [phyloDescription, setPhyloDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  // --- Clear biological fields if non-biological ---
  useEffect(() => {
    if (sampleType !== "Biological") {
      setSpecies("");
      setGenus("");
      setFamily("");
      setKingdom("Undecided");
      setCollectionDate("");
      setLat("");
      setLng("");
    }
  }, [sampleType]);

  // --- Clean up object URLs on unmount ---
  useEffect(() => {
    return () => {
      [
        ...semPreviews,
        ...microscopePreviews,
        ...petriPreview,
        ...gramPreview,
        ...phyloPreview,
        ...gelPreview,
        ...samplePhotoPreview,
        ...seqPreviews,
      ].forEach((p) => p && URL.revokeObjectURL(p));
    };
  }, [semPreviews, microscopePreviews, petriPreview, gramPreview, phyloPreview, gelPreview, samplePhotoPreview, seqPreviews]);

  // --- Handlers for microbiology nested state ---
  const setIsolatedDescriptionField = (field, value) => {
    setMicrobiologyState((prev) => ({
      ...prev,
      isolatedDescription: { ...prev.isolatedDescription, [field]: value },
    }));
  };

  const setIsolatedProfileField = (field, value) => {
    setMicrobiologyState((prev) => ({
      ...prev,
      isolatedProfile: { ...prev.isolatedProfile, [field]: value },
    }));
  };

  const toggleBiochemicalTest = (testName) => {
    setMicrobiologyState((prev) => {
      const current = prev.isolatedProfile.biochemicalTests || [];
      const exists = current.includes(testName);
      const updated = exists ? current.filter((t) => t !== testName) : [...current, testName];
      return {
        ...prev,
        isolatedProfile: { ...prev.isolatedProfile, biochemicalTests: updated },
      };
    });
  };

  const setIncubationTime = (value) => {
  setMicrobiologyState((prev) => ({
    ...prev,
    isolatedProfile: { ...prev.isolatedProfile, incubationTime: value },
  }));
};

const setEnzymatic = (value) => {
  setMicrobiologyState((prev) => ({
    ...prev,
    isolatedProfile: { ...prev.isolatedProfile, enzymatic: value },
  }));
};

const setAntimalarialAssay = (value) => {
  setMicrobiologyState((prev) => ({
    ...prev,
    isolatedProfile: { ...prev.isolatedProfile, antimalarialAssay: value },
  }));
};

const setAntibacterialAssay = (field, value) => {
  setMicrobiologyState((prev) => ({
    ...prev,
    isolatedProfile: {
      ...prev.isolatedProfile,
      antibacterialAssay: {
        ...prev.isolatedProfile.antibacterialAssay,
        [field]: value,
      },
    },
  }));
};

const setMolecularIdentification = (field, value) => {
  setMicrobiologyState((prev) => ({
    ...prev,
    isolatedProfile: {
      ...prev.isolatedProfile,
      molecularIdentification: {
        ...prev.isolatedProfile.molecularIdentification,
        [field]: value,
      },
    },
  }));
};

const setBiochemistry = (value) => {
  setMicrobiologyState((prev) => ({
    ...prev,
    isolatedProfile: {
      ...prev.isolatedProfile,
      antimalarialAssay: {
        ...prev.isolatedProfile.antimalarialAssay,
        biochemistry: value,
      },
    },
  }));
};

  // --- Handlers for molecular state ---
  const setMolecularField = (field, value) => {
    setMolecularState((prev) => ({ ...prev, [field]: value }));
  };

  // --- Upload All Files ---
  const uploadAllFiles = async () => {
    const result = {
      samplePhoto: samplePhoto[0] ? await uploadToCloudinary(samplePhoto[0]) : null,
      morphology: {
        semPhotos: await Promise.all(semFiles.map((f) => uploadToCloudinary(f))),
        microscopePhotos: await Promise.all(microscopeFiles.map((f) => uploadToCloudinary(f))),
      },
      microbiology: {
        petriPhoto: petriFile[0] ? await uploadToCloudinary(petriFile[0]) : null,
        gramPhoto: gramFile[0] ? await uploadToCloudinary(gramFile[0]) : null,
        isolatedDescription: { ...microbiologyState.isolatedDescription },
        isolatedProfile: { ...microbiologyState.isolatedProfile },
      },
      molecular: {
        phyloPhoto: phyloFile[0] ? await uploadToCloudinary(phyloFile[0]) : null,
        gelPhoto: gelFile[0] ? await uploadToCloudinary(gelFile[0]) : null,
        sequenceFiles: seqFiles.length ? await Promise.all(seqFiles.map((f) => uploadToCloudinary(f))) : [],
        phyloDescription,
        ...molecularState,
      },
    };
    return result;
  };

  // --- Handle Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalDiveSite = diveSite === "Other" ? customDiveSite : diveSite;

    if (
      sampleType === "Biological" &&
      (!species || !collectionDate || !finalDiveSite || !lat || !lng)
    ) {
      alert("Fill all required biological fields + map.");
      return;
    }

    let finalSampleNumber = sampleNumber !== "" ? Number(sampleNumber) : null;
    if (!finalSampleNumber && finalSampleNumber !== 0) {
      const filtered = samples.filter(
        (s) => s.projectType === projectType && Number(s.projectNumber) === Number(projectNumber)
      );
      const maxNum = filtered.reduce((max, s) => Math.max(max, s.sampleNumber || 0), 0);
      finalSampleNumber = maxNum + 1;
    }

    const sampleID = `${projectType}-${projectNumber}-${String(finalSampleNumber).padStart(3, "0")}`;

    const payload = {
      sampleID,
      sampleType,
      sampleName,
      projectType,
      projectNumber: Number(projectNumber),
      sampleNumber: finalSampleNumber,
      diveSite: finalDiveSite,
      collectorName,
      storageLocation,
      publications: publicationLinks.filter((link) => link.trim() !== ""),
    };

    if (sampleType === "Biological") {
      Object.assign(payload, {
        species,
        genus,
        family,
        kingdom,
        collectionDate: new Date(collectionDate),
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      });
    }

    try {
      setUploading(true);
      const uploaded = await uploadAllFiles();
      payload.samplePhoto = uploaded.samplePhoto;
      payload.morphology = uploaded.morphology;
      payload.microbiology = uploaded.microbiology;
      payload.molecular = uploaded.molecular;

      const response = await axios.post(
      "http://localhost:5000/api/samples",
      payload
      );


      setSamples([...samples, response.data]);
      alert(`Sample Submitted!\nID: ${sampleID}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Submission failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  // --- Render ---
  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* Sidebar */}
      <div
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`h-screen bg-white shadow-xl transition-all duration-300 fixed ${sidebarOpen ? "w-56" : "w-16"} flex flex-col items-start`}
      >
        <div className="flex items-center space-x-2 p-4">
          <ChevronRight className={`transition-transform duration-300 ${sidebarOpen ? "rotate-90" : ""}`} />
          {sidebarOpen && <h1 className="text-lg font-bold text-gray-700">MEROBase</h1>}
        </div>
        <nav className="flex flex-col mt-4 w-full">
          <button onClick={() => navigate("/dashboard")} className="flex items-center space-x-3 px-4 py-3 hover:bg-blue-50 rounded-lg">
            <LayoutDashboard className="text-blue-600" /> {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button onClick={() => navigate("/addsample")} className="flex items-center space-x-3 px-4 py-3 hover:bg-green-50 rounded-lg">
            <PlusCircle className="text-green-600" /> {sidebarOpen && <span>Add Sample</span>}
          </button>
          <button onClick={() => navigate("/editsample")} className="flex items-center space-x-3 px-4 py-3 hover:bg-yellow-50 rounded-lg">
            <Edit3 className="text-yellow-600" /> {sidebarOpen && <span>Edit Sample</span>}
          </button>
          <button onClick={() => navigate("/searchsample")} className="flex items-center space-x-3 px-4 py-3 hover:bg-purple-50 rounded-lg">
            <Search className="text-purple-600" /> {sidebarOpen && <span>Search Sample</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-16 md:ml-64 p-6">
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">Add New Sample</h1>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          {/* Sample Photo */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Sample Photo</label>
            <FileDropzone
              multiple={false}
              files={samplePhoto}
              setFiles={setSamplePhoto}
              previews={samplePhotoPreview}
              setPreviews={setSamplePhotoPreview}
            />
          </div>

          {/* Sample Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Sample Type</label>
            <select value={sampleType} onChange={(e) => setSampleType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option>Biological</option>
              <option>Non-Biological</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Sample Name</label>
              <input value={sampleName} onChange={(e) => setSampleName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block mb-1">Project Type</label>
              <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                <option>A</option>
                <option>B</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Project Number</label>
              <input type="number" value={projectNumber} onChange={(e) => setProjectNumber(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block mb-1">Sample Number</label>
              <input type="number" value={sampleNumber} onChange={(e) => setSampleNumber(e.target.value)} placeholder="Leave blank for auto" className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block mb-1">Dive Site</label>
              <select value={diveSite} onChange={(e) => setDiveSite(e.target.value)} required={sampleType === "Biological"} className="w-full px-4 py-2 border rounded-lg">
                <option value="">Select</option>
                {diveSites.map((s) => (<option key={s}>{s}</option>))}
              </select>
              {diveSite === "Other" && (
                <input type="text" placeholder="Type custom dive site" value={customDiveSite} onChange={(e) => setCustomDiveSite(e.target.value)} className="w-full mt-2 px-4 py-2 border rounded-lg" required />
              )}
            </div>
            <div>
              <label className="block mb-1">Collector Name</label>
              <input value={collectorName} onChange={(e) => setCollectorName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block mb-1">Storage Location</label>
              <select value={storageLocation} onChange={(e) => setStorageLocation(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                {storageLocations.map((loc) => (<option key={loc}>{loc}</option>))}
              </select>
            </div>
          </div>

          {/* Biological Fields */}
          {sampleType === "Biological" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                  {kingdoms.map((k) => (<option key={k}>{k}</option>))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Collection Date</label>
                <input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
              </div>
            </div>
          )}

          {/* Map */}
          <div className="md:col-span-2 mt-3">
            <label className="block mb-1">Sampling Location</label>
            <MapContainer center={lat && lng ? [Number(lat), Number(lng)] : [-8.65, 115.2167]} zoom={10} scrollWheelZoom className="w-full h-72 rounded-lg mb-2">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {lat && lng && <Marker position={[Number(lat), Number(lng)]} />}
              <LocationPicker setLat={setLat} setLng={setLng} />
            </MapContainer>

            {/* Manual Coordinate Input */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Latitude (Decimal Degrees)</label>
                <input
                  type="number"
                  step="0.000001"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., -8.3405"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Longitude (Decimal Degrees)</label>
                <input
                  type="number"
                  step="0.000001"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., 115.0920"
                />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Latitude: {lat || "-"} — Longitude: {lng || "-"}</p>
          </div>

          {/* Morphology */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Morphology</h3>
            <label className="block mb-1">SEM Photos (Multiple)</label>
            <FileDropzone multiple files={semFiles} setFiles={setSemFiles} previews={semPreviews} setPreviews={setSemPreviews} />
            <label className="block mt-4 mb-1">Microscope Photos (Multiple)</label>
            <FileDropzone multiple files={microscopeFiles} setFiles={setMicroscopeFiles} previews={microscopePreviews} setPreviews={setMicroscopePreviews} />
          </div>

          {/* Microbiology */}
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <h3 className="font-semibold mb-2">Microbiology — Isolated Data</h3>
            <label className="block mb-1">Petri Dish Photo</label>
            <FileDropzone multiple={false} files={petriFile} setFiles={setPetriFile} previews={petriPreview} setPreviews={setPetriPreview} />

            <label className="block mt-2 mb-1">Gram Staining Photo</label>
            <FileDropzone multiple={false} files={gramFile} setFiles={setGramFile} previews={gramPreview} setPreviews={setGramPreview} />

            {/* Isolated Description (dropdowns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block mb-1">Colony Shape</label>
                <select value={microbiologyState.isolatedDescription.colonyShape} onChange={(e) => setIsolatedDescriptionField('colonyShape', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Circular</option>
                  <option>Irregular</option>
                  <option>Filamentous</option>
                  <option>Rhizoid</option>
                  <option>Punctiform</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Margin</label>
                <select value={microbiologyState.isolatedDescription.colonyMargin} onChange={(e) => setIsolatedDescriptionField('colonyMargin', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Entire</option>
                  <option>Undulate</option>
                  <option>Lobate</option>
                  <option>Curled</option>
                  <option>Filamentous</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Elevation</label>
                <select value={microbiologyState.isolatedDescription.colonyElevation} onChange={(e) => setIsolatedDescriptionField('colonyElevation', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Flat</option>
                  <option>Raised</option>
                  <option>Convex</option>
                  <option>Umbonate</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Color</label>
                <select value={microbiologyState.isolatedDescription.colonyColor} onChange={(e) => setIsolatedDescriptionField('colonyColor', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>White</option>
                  <option>Cream</option>
                  <option>Off-white</option>
                  <option>Yellow</option>
                  <option>Pink</option>
                  <option>Red</option>
                  <option>Orange</option>
                  <option>Brown</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Texture</label>
                <select value={microbiologyState.isolatedDescription.colonyTexture} onChange={(e) => setIsolatedDescriptionField('colonyTexture', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Smooth</option>
                  <option>Rough</option>
                  <option>Wrinkled</option>
                  <option>Mucoid</option>
                  <option>Dry</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Microscopic Shape</label>
                <select value={microbiologyState.isolatedDescription.microscopicShape} onChange={(e) => setIsolatedDescriptionField('microscopicShape', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Coccus</option>
                  <option>Rod (Bacillus)</option>
                  <option>Vibrio</option>
                  <option>Spirillum</option>
                  <option>Filamentous</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Arrangement</label>
                <select value={microbiologyState.isolatedDescription.microscopicArrangement} onChange={(e) => setIsolatedDescriptionField('microscopicArrangement', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Single</option>
                  <option>Pair</option>
                  <option>Chains</option>
                  <option>Clusters</option>
                  <option>Tetrads</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            {/* Isolated Profile (physiology) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block mb-1">Gram Reaction</label>
                <select value={microbiologyState.isolatedProfile.gramReaction} onChange={(e) => setIsolatedProfileField('gramReaction', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Gram Positive</option>
                  <option>Gram Negative</option>
                  <option>Gram Variable</option>
                  <option>Not tested</option>
                  <option>None</option>
                </select>
              </div>
              <div>
                 <label className="block mb-1">Incubation Time (hours)</label>
                  <input
                  type="number"
                  min="0"
                  value={microbiologyState.isolatedProfile.incubationTime}
                  onChange={(e) => setIncubationTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="e.g., 24"
                />
              </div>
              <div>
                <label className="block mb-1">Motility</label>
                <select value={microbiologyState.isolatedProfile.motility} onChange={(e) => setIsolatedProfileField('motility', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Motile</option>
                  <option>Non-motile</option>
                  <option>Swarming</option>
                  <option>Gliding</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Halotolerance</label>
                <select value={microbiologyState.isolatedProfile.halotolerance} onChange={(e) => setIsolatedProfileField('halotolerance', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>Non-halophilic</option>
                  <option>Slightly halophilic</option>
                  <option>Moderately halophilic</option>
                  <option>Extremely halophilic</option>
                  <option>None</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Growth Media Used (Agar Media)</label>
                <select value={microbiologyState.isolatedProfile.agarMedia} onChange={(e) => setIsolatedProfileField('agarMedia', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>NA</option>
                  <option>TSA</option>
                  <option>PCA</option>
                  <option>R2A</option>
                  <option>MacConkey</option>
                  <option>None</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
  <h3 className="text-lg font-semibold mb-2">Antibacterial Assay</h3>

  {/* Pathogen Dropdown */}
  <div className="mb-4">
    <label className="block mb-1">Pathogen</label>
    <select
      value={microbiologyState.isolatedProfile.antibacterialAssay.pathogen}
      onChange={(e) => setAntibacterialAssay("pathogen", e.target.value)}
      className="w-full px-4 py-2 border rounded-lg"
    >
      <option value="">Select pathogen</option>
      <option value="Methicillin-resistant Staphylococcus aureus">Methicillin-resistant Staphylococcus aureus</option>
      <option value="Escherichia coli">Escherichia coli</option>
      <option value="Pseudomonas aeruginosa">Pseudomonas aeruginosa</option>
      <option value="Bacillus subtilis">Bacillus subtilis</option>
      <option value="Salmonella typhi">Salmonella typhi</option>
      <option value="Salmonella typhimurium">Salmonella typhimurium</option>
      <option value="Acinetobacter baumannii">Acinetobacter baumannii</option>
      <option value="Klebsiella pneumoniae">Klebsiella pneumoniae</option>
      <option value="Aeromonas hydrophila">Aeromonas hydrophila</option>
      <option value="Vibrio parahaemolyticus">Vibrio parahaemolyticus</option>
    </select>
  </div>

  {/* Method Dropdown */}
  <div className="mb-4">
    <label className="block mb-1">Method</label>
    <select
      value={microbiologyState.isolatedProfile.antibacterialAssay.method}
      onChange={(e) => setAntibacterialAssay("method", e.target.value)}
      className="w-full px-4 py-2 border rounded-lg"
    >
      <option value="">Select method</option>
      <option value="Disc diffusion">Disc diffusion</option>
      <option value="Agar well diffusion">Agar well diffusion</option>
      <option value="Agar plug diffusion">Agar plug diffusion</option>
      <option value="Soft agar overlay technique">Soft agar overlay technique</option>
    </select>
  </div>
</div>

{/* Biochemical Tests (multi-select checkboxes) */}
<div className="mt-4">
  <label className="block mb-2 font-medium">Biochemical Tests</label>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
    {[
      'Catalase',
      'Oxidase',
      'Urease',
      'Gelatin hydrolysis',
      'Sulfide production',
      'Nitrate reduction',
      'Fermentation',
      'Indole',
      'Citrate'
    ].map((test) => (
      <label key={test} className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={(microbiologyState.isolatedProfile.biochemicalTests || []).includes(test)}
          onChange={() => toggleBiochemicalTest(test)}
        />
        <span className="text-sm">{test}</span>
      </label>
    ))}
  </div>

  {/* Biochemical Tests Description */}
  <div className="mt-3">
    <label className="block mb-1 font-medium">Description / Notes</label>
    <textarea
      value={microbiologyState.isolatedProfile.biochemicalDescription || ""}
      onChange={(e) => setIsolatedProfileField('biochemicalDescription', e.target.value)}
      className="w-full px-4 py-2 border rounded-lg"
      placeholder="Write additional notes about the biochemical tests here..."
    />
  </div>
</div>

<div>
  <label className="block mb-1">Enzymatic</label>
  <select
    value={microbiologyState.isolatedProfile.enzymatic}
    onChange={(e) => setEnzymatic(e.target.value)}
    className="w-full px-4 py-2 border rounded-lg"
  >
    <option value="">Select enzyme</option>
    <option value="Amylase">Amylase</option>
    <option value="Protease">Protease</option>
    <option value="Lipase">Lipase</option>
    <option value="Cellulase">Cellulase</option>
    <option value="Alkane Hydroxylase">Alkane Hydroxylase</option>
    <option value="Manganese Peroxidase">Manganese Peroxidase</option>
    <option value="Laccase">Laccase</option>
  </select>
</div>

<div className="mt-4">
  <label className="block mb-1">Antimalarial Assay</label>
  <select
    value={microbiologyState.isolatedProfile.antimalarialAssay}
    onChange={(e) => setAntimalarialAssay(e.target.value)}
    className="w-full px-4 py-2 border rounded-lg"
  >
    <option value="">Select Plasmodium species</option>
    <option value="Plasmodium berghei">Plasmodium berghei</option>
    <option value="Plasmodium falciparum">Plasmodium falciparum</option>
  </select>
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Biochemistry
  </label>
  <select
    value={microbiologyState.isolatedProfile.antimalarialAssay.biochemistry || ""}
    onChange={(e) => setBiochemistry(e.target.value)}
    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-2"
  >
    <option value="">Select Biochemistry</option>
    <option value="Oxidase">Oxidase</option>
    <option value="Katalase">Katalase</option>
  </select>
</div>

<div className="mt-6">
  <h3 className="text-lg font-semibold mb-2">Molecular Identification</h3>
  {/* Sequence input */}
  <div className="mb-4">
    <label className="block mb-1">Sequence</label>
    <textarea
      value={microbiologyState.isolatedProfile.molecularIdentification.sequence}
      onChange={(e) => setMolecularIdentification("sequence", e.target.value)}
      placeholder="Enter sequence manually"
      className="w-full px-4 py-2 border rounded-lg"
      rows={4}
    />
  </div>
</div>

          </div>

          {/* Molecular */}
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <h3 className="font-semibold mb-2">Molecular</h3>

            <label className="block mb-1">Phylogenetic Photo</label>
            <FileDropzone multiple={false} files={phyloFile} setFiles={setPhyloFile} previews={phyloPreview} setPreviews={setPhyloPreview} />

            <label className="block mt-2 mb-1">Gel Image (optional)</label>
            <FileDropzone multiple={false} files={gelFile} setFiles={setGelFile} previews={gelPreview} setPreviews={setGelPreview} />

            <label className="block mt-2 mb-1">Sequence Files (optional, .fastq .fq .ab1 etc)</label>
            <FileDropzone
              multiple={true}
              accept=".fastq,.fq,.ab1,.txt,.csv,.fasta,.fa"
              files={seqFiles}
              setFiles={setSeqFiles}
              previews={seqPreviews}
              setPreviews={setSeqPreviews}
            />

            <label className="block mt-2 mb-1">Marker Gene / Target</label>
            <select value={molecularState.geneTarget} onChange={(e) => setMolecularField("geneTarget", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
              <option>None</option>
              <option>16S rRNA</option>
              <option>18S rRNA</option>
              <option>23S rRNA</option>
              <option>ITS Region</option>
              <option>COI</option>
              <option>tufA</option>
              <option>rbcL</option>
              <option>gyrB</option>
              <option>hsp60</option>
              <option>matK</option>
              <option>Multi-locus (MLST)</option>
              <option>Whole Genome</option>
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block mb-1">DNA Source</label>
                <select value={molecularState.dnaSource} onChange={(e) => setMolecularField("dnaSource", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>Genomic DNA</option>
                  <option>Plasmid DNA</option>
                  <option>Environmental DNA (eDNA)</option>
                  <option>Metagenomic DNA</option>
                  <option>RNA (cDNA)</option>
                  <option>Mitochondrial DNA</option>
                  <option>Chloroplast DNA</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">DNA Extraction Method</label>
                <select value={molecularState.extractionMethod} onChange={(e) => setMolecularField("extractionMethod", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>CTAB Method</option>
                  <option>Phenol–Chloroform Extraction</option>
                  <option>Silica Column Kit (e.g., Qiagen)</option>
                  <option>Magnetic Bead Extraction</option>
                  <option>Chelex Extraction</option>
                  <option>SDS-based Lysis</option>
                  <option>Boiling Prep</option>
                  <option>Enzymatic Lysis + Purification Kit</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Primer Set Used</label>
                <select value={molecularState.primerSet} onChange={(e) => setMolecularField("primerSet", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>27F/1492R (Universal Bacteria)</option>
                  <option>63F/1387R</option>
                  <option>8F/1492R</option>
                  <option>ITS1/ITS4</option>
                  <option>LCO1490/HCO2198 (COI)</option>
                  <option>CYA359F/CYA781R (Cyanobacteria)</option>
                  <option>515F/806R (16S V4)</option>
                  <option>341F/785R (16S V3–V4)</option>
                  <option>18S rRNA universal primers</option>
                  <option>Custom Primers</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">PCR Platform</label>
                <select value={molecularState.pcrPlatform} onChange={(e) => setMolecularField("pcrPlatform", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>Standard PCR</option>
                  <option>Gradient PCR</option>
                  <option>Touchdown PCR</option>
                  <option>qPCR (SYBR Green)</option>
                  <option>qPCR (Probe-based)</option>
                  <option>Digital PCR</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">PCR Protocol Type</label>
                <select value={molecularState.pcrProtocol} onChange={(e) => setMolecularField("pcrProtocol", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>Standard 3-step PCR</option>
                  <option>2-step PCR</option>
                  <option>Touchdown PCR</option>
                  <option>Nested PCR</option>
                  <option>Multiplex PCR</option>
                  <option>High-Fidelity PCR</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Sequencing Method</label>
                <select value={molecularState.sequencingMethod} onChange={(e) => setMolecularField("sequencingMethod", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>Sanger Sequencing</option>
                  <option>Illumina MiSeq</option>
                  <option>Illumina HiSeq</option>
                  <option>Illumina NextSeq</option>
                  <option>Oxford Nanopore MinION</option>
                  <option>PacBio</option>
                  <option>Shotgun Metagenomics</option>
                  <option>Amplicon Sequencing</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Sequencing Vendor / Lab</label>
                <select value={molecularState.sequencingVendor} onChange={(e) => setMolecularField("sequencingVendor", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>Macrogen</option>
                  <option>First Base</option>
                  <option>GeneWiz</option>
                  <option>Novogene</option>
                  <option>BGI</option>
                  <option>Local University Lab</option>
                  <option>In-house Sequencer</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Sequence Quality</label>
                <select value={molecularState.sequenceQuality} onChange={(e) => setMolecularField("sequenceQuality", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>High Quality</option>
                  <option>Medium Quality</option>
                  <option>Low Quality</option>
                  <option>Contamination Suspected</option>
                  <option>Needs Re-sequencing</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Bioinformatics Pipeline</label>
                <select value={molecularState.bioinformaticsPipeline} onChange={(e) => setMolecularField("bioinformaticsPipeline", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>BLASTn</option>
                  <option>QIIME2</option>
                  <option>Mothur</option>
                  <option>DADA2</option>
                  <option>MEGA X</option>
                  <option>Geneious</option>
                  <option>RDP Classifier</option>
                  <option>Kraken2</option>
                  <option>Custom pipeline</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Accession / Submission</label>
                <select value={molecularState.accessionType} onChange={(e) => setMolecularField("accessionType", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>NCBI GenBank</option>
                  <option>BOLD</option>
                  <option>SILVA</option>
                  <option>RDP</option>
                  <option>EMBL</option>
                  <option>DDBJ</option>
                  <option>Not Submitted</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">DNA Concentration Range</label>
                <select value={molecularState.dnaConcentrationRange} onChange={(e) => setMolecularField("dnaConcentrationRange", e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                  <option>None</option>
                  <option>{"<10 ng/µL"}</option>
                  <option>10–20 ng/µL</option>
                  <option>20–50 ng/µL</option>
                  <option>50–100 ng/µL</option>
                  <option>{">100 ng/µL"}</option>
                </select>
              </div>
            </div>

            <label className="block mt-3 mb-1">Phylogenetic Description / Notes</label>
            <textarea value={phyloDescription} onChange={(e) => setPhyloDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
          </div>

          {/* Publication Links */}
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <h3 className="font-semibold mb-2">Publication Links</h3>
            {publicationLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-center mb-2">
                <input
                  type="url"
                  placeholder="Paste publication URL"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <button type="button" onClick={() => removePublicationLink(index)} className="px-3 py-2 bg-red-500 text-white rounded-lg">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addPublicationLink} className="px-4 py-2 bg-green-500 text-white rounded-lg">Add Link</button>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            {uploading ? "Submitting..." : "Submit Sample"}
          </button>
        </form>
      </div>
    </div>
  );
}
