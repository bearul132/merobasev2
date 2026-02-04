import React from "react";
import { InfoGrid, Info, ImageGrid } from "./SharedComponents";

export default function MetadataTab({ metadata }) {
  if (!metadata) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Metadata & Collection</h2>
      <InfoGrid>
        <Info label="Sample Name" value={metadata.sampleName} />
        <Info label="Sample Type" value={metadata.sampleType} />
        <Info label="Project Type" value={metadata.projectType} />
        <Info label="Project Number" value={metadata.projectNumber} />
        <Info label="Collector" value={metadata.collectorName} />
        <Info label="Kingdom" value={metadata.kingdom} />
        <Info label="Family" value={metadata.family} />
        <Info label="Genus" value={metadata.genus} />
        <Info label="Species" value={metadata.species} />
        <Info label="Storage Location" value={metadata.storageLocation} />
        <Info label="Latitude" value={metadata.latitude} />
        <Info label="Longitude" value={metadata.longitude} />
      </InfoGrid>
      <ImageGrid
        title="Sample Photo"
        images={metadata.samplePhoto ? [metadata.samplePhoto] : []}
      />
    </div>
  );
}
