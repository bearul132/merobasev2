import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const SampleFormContext = createContext(null);

export function SampleFormProvider({ children }) {
  /* ================= INITIAL STRUCTURE ================= */
  const initial = {
    metadata: {
      sampleId: "",
      sampleName: "",
      sampleType: "Biological",
      projectType: "A",
      projectNumber: "",
      sampleNumber: "",
      diveSite: "",
      customDiveSite: "",
      collectorName: "",
      storageLocation: "Cool Room",
      species: "",
      genus: "",
      family: "",
      kingdom: "Undecided",
      collectionDate: "",
      latitude: "",
      longitude: "",
      samplePhoto: null,
      samplePhotoName: ""
    },

    morphology: {
      semPhotos: [],
      microPhotos: [],
      petriPhoto: null,
      gramPhoto: null,
      notes: "",
      isolatedDescription: {}
    },

    microbiology: {
      primaryIsolatedData: {
        isolatedId: "",
        shelf: "",
        position: "",
        storageTemperature: "",
        agarMedia: "",
        solvent: "",
        incubationTemperature: "",
        incubationTime: "",
        oxygenRequirement: "",
        notes: ""
      },

      images: {
        isolated: null,
        microscopic: null
      },

      macroscopicMorphology: {
        shape: "",
        arrangement: ""
      },

      colonyDescription: {
        shape: "",
        margin: "",
        elevation: "",
        color: "",
        texture: "",
        motility: ""
      },

      microscopicMorphology: {
        shape: "",
        arrangement: "",
        gramReaction: ""
      },

      antibacterialAssay: {
        pathogen: "",
        method: "",
        antimalarial: "",
        molecularId: ""
      },

      biochemicalTests: [],
      enzymaticTests: [],
      testNotes: "",

      molecularIdentification: {
        identified: "",
        speciesName: "",
        pcrPlatform: "",
        pcrProtocolType: "",
        sequencingMethod: "",
        bioinformaticsPipeline: "",
        accessionStatus: "",
        accessionNumber: "",
        rawSequenceFiles: []
      }
    },

    molecular: {
      gelImage: null,
      rawSequenceFiles: [],
      markerGene: "",
      dnaSource: "",
      extractionKit: "",
      extractionMethod: "",
      primerSet: { forward: "", reverse: "" },
      pcrMethod: "",
      pcrProtocolType: "",
      sequencingMethod: "",
      sequencingQuality: "",
      bioinformaticsPipeline: "",
      accessionStatus: "",
      accessionNumber: "",
      dnaConcentrationRange: "",
      phylogeneticNotes: ""
    },

    publication: {
      links: [""]
    }
  };

  /* ================= MODE ================= */
  const [mode, setMode] = useState("add"); // add | edit
  const [editingSampleId, setEditingSampleId] = useState(null);

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState(() => {
    try {
      const raw = localStorage.getItem("merobase_addsample_draft");
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  /* ================= AUTOSAVE ================= */
  useEffect(() => {
    try {
      localStorage.setItem(
        "merobase_addsample_draft",
        JSON.stringify(formData)
      );
    } catch {}
  }, [formData]);

  /* ================= HELPERS ================= */
  const updateSection = (section, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...value
      }
    }));
  };

  const setSection = (section, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  /* ================= EDIT MODE ================= */
  const loadSampleForEdit = (sample) => {
    if (!sample?.metadata?.sampleId) {
      console.error("Invalid sample passed to edit");
      return;
    }

    setMode("edit");
    setEditingSampleId(sample.metadata.sampleId);
    setFormData(sample);

    localStorage.setItem(
      "merobase_addsample_draft",
      JSON.stringify(sample)
    );
  };

  /* ================= CLEAR ================= */
  const clearDraftOnly = () => {
    localStorage.removeItem("merobase_addsample_draft");
    setFormData(initial);
  };

  const exitEditMode = () => {
    setMode("add");
    setEditingSampleId(null);
  };

  /* ================= SUBMIT ================= */
  const submitSampleToLocalStorage = () => {
    let samples = [];

    try {
      samples =
        JSON.parse(localStorage.getItem("merobase_samples")) || [];
    } catch {
      samples = [];
    }

    if (mode === "edit") {
      if (!editingSampleId) {
        console.error("Edit mode active but no editingSampleId");
        return;
      }

      const index = samples.findIndex(
        s => s.metadata?.sampleId === editingSampleId
      );

      if (index === -1) {
        console.error("Edit failed: sample not found");
        return;
      }

      samples[index] = {
        ...formData,
        metadata: {
          ...formData.metadata,
          sampleId: editingSampleId
        },
        lastEdited: new Date().toISOString()
      };

      localStorage.setItem(
        "merobase_samples",
        JSON.stringify(samples)
      );

      clearDraftOnly();
      return;
    }

    /* ---------- ADD MODE ---------- */
    const newSampleId =
      formData.metadata.sampleId || `SAMPLE-${Date.now()}`;

    const newSample = {
      ...formData,
      metadata: {
        ...formData.metadata,
        sampleId: newSampleId
      },
      createdAt: new Date().toISOString()
    };

    localStorage.setItem(
      "merobase_samples",
      JSON.stringify([newSample, ...samples])
    );

    clearDraftOnly();
  };

  /* ================= PROVIDER ================= */
  return (
    <SampleFormContext.Provider
      value={{
        formData,
        setFormData,
        updateSection,
        setSection,
        mode,
        editingSampleId,
        loadSampleForEdit,
        submitSampleToLocalStorage,
        clearDraftOnly,
        exitEditMode
      }}
    >
      {children}
    </SampleFormContext.Provider>
  );
}

/* ================= HOOK ================= */
export const useSampleFormContext = () => {
  const ctx = useContext(SampleFormContext);
  if (!ctx) {
    throw new Error(
      "useSampleFormContext must be used inside SampleFormProvider"
    );
  }
  return ctx;
};

export const useSampleForm = useSampleFormContext;
