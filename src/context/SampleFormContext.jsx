import React, { createContext, useContext, useEffect, useState } from 'react';

const SampleFormContext = createContext(null);

export function SampleFormProvider({ children }) {
  const initial = {
    metadata: {
      sampleName: '', sampleType: 'Biological', projectType: 'A', projectNumber: '', sampleNumber: '',
      diveSite: '', customDiveSite: '', collectorName: '', storageLocation: 'Cool Room',
      species: '', genus: '', family: '', kingdom: 'Undecided', collectionDate: '',
      latitude: '', longitude: '', samplePhoto: null, samplePhotoName: ''
    },
    morphology: { semPhotos: [], microscopePhotos: [], petriPhoto: null, gramPhoto: null, isolatedDescription: {} },
    microbiology: { isolatedProfile: {}, antibacterialAssay: {}, biochemicalTests: [], biochemicalDescription: '' },
    molecular: { phyloPhoto: null, gelPhoto: null, seqFiles: [], molecularState: {}, phyloDescription: '' },
    publication: { links: [''] }
  };

  const [formData, setFormData] = useState(() => {
    try { const raw = localStorage.getItem('merobase_addsample_draft'); return raw ? JSON.parse(raw) : initial; }
    catch (e) { return initial; }
  });

  useEffect(() => {
    localStorage.setItem('merobase_addsample_draft', JSON.stringify(formData));
  }, [formData]);

  const updateSection = (section, value) => setFormData(p => ({ ...p, [section]: { ...p[section], ...value } }));
  const setSection = (section, value) => setFormData(p => ({ ...p, [section]: value }));
  const clearDraft = () => { localStorage.removeItem('merobase_addsample_draft'); setFormData(initial); };

  return (
    <SampleFormContext.Provider value={{ formData, updateSection, setSection, setFormData, clearDraft }}>
      {children}
    </SampleFormContext.Provider>
  );
}

export const useSampleFormContext = () => {
  const ctx = useContext(SampleFormContext);
  if (!ctx) throw new Error('useSampleFormContext must be used inside SampleFormProvider');
  return ctx;
};

// ✅ optional alias to match previous import
export const useSampleForm = useSampleFormContext;
