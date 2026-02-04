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
      primaryIsolated: {
        isolatedId: "",
        shelf: "",
        positionInBox: "",
        storageTemperature: "-20°C",
        agarMedia: "",
        solvent: "Aquades",
        incubationTemperature: "",
        incubationTime: "",
        oxygenRequirement: "",
        notes: ""
      },

      isolatedMorphology: {
        isolatedImage: null,
        macroscopic: {
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
        microscopicImage: null,
        microscopic: {
          shape: "",
          arrangement: "",
          gramReaction: ""
        }
      },

      microbiologyTests: {
        antibacterialAssay: {
          pathogen: "",
          method: "",
          antimalarialAssay: "",
          molecularId: "No"
        },

        biochemicalTests: {
          catalase: false,
          oxidase: false,
          urease: false,
          gelatinHydrolysis: false,
          sulfideProduction: false,
          nitrateReduction: false,
          fermentation: false,
          indole: false,
          citrate: false
        },

        enzymaticTests: {
          amylase: false,
          protease: false,
          lipase: false,
          cellulase: false,
          alkaneHydroxylase: false,
          manganesePeroxidase: false,
          laccase: false
        },

        testNotes: "",
        rawSequenceFile: null,

        hasMolecularID: false,
        molecularIdentification: {
          speciesName: "",
          pcrPlatform: "",
          pcrProtocolType: "",
          sequencingMethod: "",
          bioinformaticsPipeline: "",
          accessionStatus: "Unpublished",
          accessionNumber: ""
        }
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
  const [mode, setMode] = useState("add");
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

  /* ================= AUTOSAVE (WITH IMAGES) ================= */
  useEffect(() => {
    try {
      localStorage.setItem(
        "merobase_addsample_draft",
        JSON.stringify(formData)
      );
    } catch (err) {
      console.warn("Autosave skipped (storage limit)", err);
    }
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
      console.error("Invalid sample for edit");
      return;
    }

    setMode("edit");
    setEditingSampleId(sample.metadata.sampleId);
    setFormData(sample);
  };

  const exitEditMode = () => {
    setMode("add");
    setEditingSampleId(null);
  };

  /* ================= CLEAR ================= */
  const clearDraftOnly = () => {
    localStorage.removeItem("merobase_addsample_draft");
    setFormData(initial);
  };

  /* ================= SUBMIT (IMAGES KEPT) ================= */
  const submitSampleToLocalStorage = () => {
    let samples = [];

    try {
      samples =
        JSON.parse(localStorage.getItem("merobase_samples")) || [];
    } catch {
      samples = [];
    }

    if (mode === "edit") {
      const index = samples.findIndex(
        s => s.metadata?.sampleId === editingSampleId
      );

      if (index === -1) {
        alert("Edit failed: sample not found");
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
    } else {
      samples.unshift({
        ...formData,
        metadata: {
          ...formData.metadata,
          sampleId:
            formData.metadata.sampleId ||
            `SAMPLE-${Date.now()}`
        },
        createdAt: new Date().toISOString()
      });
    }

    localStorage.setItem(
      "merobase_samples",
      JSON.stringify(samples)
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
