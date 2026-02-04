import { useSampleFormContext } from "../context/SampleFormContext";

/**
 * Public hook for interacting with Sample Form state
 * Acts as an abstraction layer over context
 */
export const useSampleForm = () => {
  const ctx = useSampleFormContext();

  if (!ctx) {
    throw new Error("useSampleForm must be used within SampleFormProvider");
  }

  return {
    // core state
    formData: ctx.formData,
    mode: ctx.mode,
    editingSampleId: ctx.editingSampleId,

    // state setters
    setFormData: ctx.setFormData,
    updateSection: ctx.updateSection,
    setSection: ctx.setSection,

    // image helpers
    normalizeImage: ctx.normalizeImage,

    // lifecycle actions
    loadSampleForEdit: ctx.loadSampleForEdit,
    submitSampleToLocalStorage: ctx.submitSampleToLocalStorage,
    clearDraftOnly: ctx.clearDraftOnly,
    exitEditMode: ctx.exitEditMode
  };
};
