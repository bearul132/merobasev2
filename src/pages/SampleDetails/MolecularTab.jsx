import React from "react";
import { InfoGrid, Info, ImageGrid } from "./SharedComponents";

export default function MolecularTab({ molecular }) {
  if (!molecular) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Molecular Biology</h2>

      <InfoGrid>
        <Info label="Marker Gene" value={molecular.markerGene} />
        <Info label="DNA Source" value={molecular.dnaSource} />
        <Info label="Extraction Kit" value={molecular.extractionKit} />
        <Info label="Extraction Method" value={molecular.extractionMethod} />
        <Info label="PCR Method" value={molecular.pcrMethod} />
        <Info label="Sequencing Method" value={molecular.sequencingMethod} />
        <Info label="Bioinformatics Pipeline" value={molecular.bioinformaticsPipeline} />
        <Info label="Accession Status" value={molecular.accessionStatus} />
        <Info label="Accession Number" value={molecular.accessionNumber} />
        <Info label="DNA Concentration" value={molecular.dnaConcentrationRange} />
        <Info label="Phylogenetic Notes" value={molecular.phylogeneticNotes} />
      </InfoGrid>

      <ImageGrid title="Gel Image" images={molecular.gelImage ? [molecular.gelImage] : []} />
      <ImageGrid title="Raw Sequence Files" images={molecular.rawSequenceFiles || []} />
    </div>
  );
}
