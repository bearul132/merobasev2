import React, { createContext, useContext, useEffect, useState } from "react";

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
      storageBox: {
        boxID: "",
        shelf: "",
        position: "",
        temperature: "",
        notes: ""
      },
      images: {
        isolated: null,
        macroscopic: null,
        microscopic: null
      },
      isolatedDescription: {
        shape: "",
        margin: "",
        elevation: "",
        color: "",
        texture: ""
      },
      macroscopicMorphology: {
        shape: "",
        arrangement: ""
      },
      microscopicMorphology: {
        shape: "",
        arrangement: "" 
      },
      molecularIdentification: {
        rawSequenceFiles: [],
        pcrPlatform: "",
        pcrProtocolType: "",
        sequencingMethod: "",
        bioinformaticsPipeline: "",
        accessionStatus: ""
      },
      isolatedProfile: {
        gramReaction: "",
        motility: "",
        oxygenRequirement: "",
        temperaturePreference: "",
        agarMedia: "",
        incubationTime: "",
        enzymatic: ""
      },
      biochemicalTests: [],
      testNotes: ""
    },

    molecular: {
      gelImage: null,
      rawSequenceFiles: [],
      markerGene: "",
      dnaSource: "",
      extractionKit: "",
      extractionMethod: "",
      primerSet: "",
      pcrPlatform: "",
      pcrProtocol: "",
      sequencingMethod: "",
      sequencingVendor: "",
      sequencingQuality: "",
      bioinformaticsPipeline: "",
      accessionStatus: "",
      dnaConcentration: "",
      phylogeneticNotes: ""
    },

    publication: {
      links: [""]
    }
  };

  /* ================= MODE STATE ================= */
  const [mode, setMode] = useState("add"); // "add" | "edit"
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

  /* ================= AUTOSAVE DRAFT ================= */
  useEffect(() => {
    localStorage.setItem("merobase_addsample_draft", JSON.stringify(formData));
  }, [formData]);

  /* ================= HELPERS ================= */
  const updateSection = (section, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...value }
    }));
  };

  const setSection = (section, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const clearDraft = () => {
    localStorage.removeItem("merobase_addsample_draft");
    setFormData(initial);
    setMode("add");
    setEditingSampleId(null);
  };

  /* ================= EDIT MODE ================= */
  /**
   * Load an existing sample into wizard (EDIT MODE)
   */
  const loadSampleForEdit = (sample) => {
    if (!sample?.metadata?.sampleId) {
      console.error("Invalid sample passed to edit");
      return;
    }

    setFormData(sample);
    setMode("edit");
    setEditingSampleId(sample.metadata.sampleId);

    // save draft
    localStorage.setItem("merobase_addsample_draft", JSON.stringify(sample));
  };

  /**
   * Add or overwrite sample in localStorage
   */
  const submitSampleToLocalStorage = () => {
    let samples = [];
    try {
      samples = JSON.parse(localStorage.getItem("merobase_samples")) || [];
    } catch {
      samples = [];
    }

    if (mode === "edit") {
      // Overwrite the existing sample
      const updatedSamples = samples.map(s =>
        s.metadata.sampleId === editingSampleId
          ? {
              ...formData,
              metadata: { ...formData.metadata, sampleId: editingSampleId },
              lastEdited: new Date().toISOString()
            }
          : s
      );

      localStorage.setItem("merobase_samples", JSON.stringify(updatedSamples));
    } else {
      // Add new sample
      const newSampleId = formData.metadata.sampleId || `SAMPLE-${Date.now()}`;
      const newSample = {
        ...formData,
        metadata: { ...formData.metadata, sampleId: newSampleId },
        createdAt: new Date().toISOString()
      };
      localStorage.setItem(
        "merobase_samples",
        JSON.stringify([newSample, ...samples])
      );
    }

    clearDraft(); // reset form and mode
  };

  /* ================= MOCK UPLOAD ================= */
  const uploadToCloudinaryBase64 = async (base64, name) => {
    return { url: base64, name, uploadedAt: new Date().toISOString() };
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
        clearDraft,
        uploadToCloudinaryBase64
      }}
    >
      {children}
    </SampleFormContext.Provider>
  );
}

/* ================= HOOK ================= */
export const useSampleFormContext = () => {
  const ctx = useContext(SampleFormContext);
  if (!ctx) throw new Error("useSampleFormContext must be used inside SampleFormProvider");
  return ctx;
};

export const useSampleForm = useSampleFormContext;
