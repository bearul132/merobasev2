import React from "react";
import { ImageGrid } from "./SharedComponents";

export default function MorphologyTab({ morphology }) {
  if (!morphology) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Morphology</h2>

      <ImageGrid
        title="SEM Photos"
        images={morphology.semPhotos || []}
      />

      <ImageGrid
        title="Microscope Photos"
        images={morphology.microscopePhotos || []}
      />
    </div>
  );
}
