import React, { createContext, useContext, useEffect, useState } from 'react';

const SampleFormContext = createContext(null);

export function SampleFormProvider({ children }) {
  const initial = {
    /* ================= METADATA ================= */
    metadata: {
      sampleName: '',
      sampleType: 'Biological',
      projectType: 'A',
      projectNumber: '',
      sampleNumber: '',
      diveSite: '',
      customDiveSite: '',
      collectorName: '',
      storageLocation: 'Cool Room',
      species: '',
      genus: '',
      family: '',
      kingdom: 'Undecided',
      collectionDate: '',
      latitude: '',
      longitude: '',
      samplePhoto: null,
      samplePhotoName: ''
    },

    /* ================= MORPHOLOGY ================= */
    morphology: {
      semPhotos: [],
      microscopePhotos: [],
      petriPhoto: null,
      gramPhoto: null,
      isolatedDescription: {}
    },

    /* ================= MICROBIOLOGY ================= */
    microbiology: {
      storageBox: {
        boxID: '',
        shelf: '',
        position: '',
        temperature: '',
        notes: ''
      },

      images: {
        isolated: null,
        macroscopic: null,
        microscopic: null
      },

      isolatedDescription: {
        shape: '',
        margin: '',
        elevation: '',
        color: '',
        texture: ''
      },

      macroscopicMorphology: {
        shape: '',
        arrangement: ''
      },

      microscopicMorphology: {
        shape: '',
        arrangement: ''
      },

      isolatedProfile: {
        gramReaction: '',
        motility: '',
        oxygenRequirement: '',
        temperaturePreference: '',
        agarMedia: '',
        incubationTime: '',
        enzymatic: ''
      },

      biochemicalTests: [],
      testNotes: ''
    },

    /* ================= MOLECULAR (UPDATED) ================= */
    molecular: {
      gelImage: null,
      rawSequenceFiles: [],

      markerGene: '',
      dnaSource: '',
      extractionKit: '',
      extractionMethod: '',
      primerSet: '',
      pcrPlatform: '',
      pcrProtocol: '',
      sequencingMethod: '',
      sequencingVendor: '',
      sequencingQuality: '',
      bioinformaticsPipeline: '',
      accessionStatus: '',
      dnaConcentration: '',
      phylogeneticNotes: ''
    },

    /* ================= PUBLICATION ================= */
    publication: {
      links: ['']
    }
  };

  const [formData, setFormData] = useState(() => {
    try {
      const raw = localStorage.getItem('merobase_addsample_draft');
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  /* ================= AUTOSAVE ================= */
  useEffect(() => {
    localStorage.setItem(
      'merobase_addsample_draft',
      JSON.stringify(formData)
    );
  }, [formData]);

  /* ================= HELPERS ================= */
  const updateSection = (section, value) =>
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...value
      }
    }));

  const setSection = (section, value) =>
    setFormData(prev => ({
      ...prev,
      [section]: value
    }));

  const clearDraft = () => {
    localStorage.removeItem('merobase_addsample_draft');
    setFormData(initial);
  };

  return (
    <SampleFormContext.Provider
      value={{
        formData,
        updateSection,
        setSection,
        setFormData,
        clearDraft
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
      'useSampleFormContext must be used inside SampleFormProvider'
    );
  }
  return ctx;
};

export const useSampleForm = useSampleFormContext;
