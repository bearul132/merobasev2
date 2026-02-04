import React from "react";
import { InfoGrid, Info, ImageGrid } from "./SharedComponents";

export default function IsolatedMorphologyTab({ isolated }) {
  if (!isolated) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        Isolated Morphology
      </h2>

      {/* ================= TEXT DATA ================= */}
      <InfoGrid>
        <Info label="Macroscopic Shape" value={isolated.macroscopic?.shape} />
        <Info label="Macroscopic Arrangement" value={isolated.macroscopic?.arrangement} />

        <Info label="Colony Shape" value={isolated.colonyDescription?.shape} />
        <Info label="Colony Margin" value={isolated.colonyDescription?.margin} />
        <Info label="Colony Elevation" value={isolated.colonyDescription?.elevation} />
        <Info label="Colony Color" value={isolated.colonyDescription?.color} />
        <Info label="Colony Texture" value={isolated.colonyDescription?.texture} />
        <Info label="Motility" value={isolated.colonyDescription?.motility} />

        <Info label="Microscopic Shape" value={isolated.microscopic?.shape} />
        <Info label="Microscopic Arrangement" value={isolated.microscopic?.arrangement} />
        <Info label="Gram Reaction" value={isolated.microscopic?.gramReaction} />
      </InfoGrid>

      {/* ================= IMAGES ================= */}
      <ImageGrid
        title="Macroscopic Images"
        images={isolated.macroscopic?.images || []}
      />

      <ImageGrid
        title="Colony Images"
        images={isolated.colonyDescription?.images || []}
      />

      <ImageGrid
        title="Microscopic Images"
        images={isolated.microscopic?.images || []}
      />
    </div>
  );
}
