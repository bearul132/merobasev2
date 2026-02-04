import React from "react";
import { InfoGrid, Info } from "./SharedComponents";

export default function PrimaryIsolatedTab({ primary }) {
  if (!primary) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Primary Isolated</h2>
      <InfoGrid>
        <Info label="Isolated ID" value={primary.isolatedId} />
        <Info label="Shelf" value={primary.shelf} />
        <Info label="Position in Box" value={primary.positionInBox} />
        <Info label="Storage Temperature" value={primary.storageTemperature} />
        <Info label="Agar Media" value={primary.agarMedia} />
        <Info label="Solvent" value={primary.solvent} />
        <Info label="Incubation Temperature" value={primary.incubationTemperature} />
        <Info label="Incubation Time" value={primary.incubationTime} />
        <Info label="Oxygen Requirement" value={primary.oxygenRequirement} />
        <Info label="Notes" value={primary.notes} />
      </InfoGrid>
    </div>
  );
}
