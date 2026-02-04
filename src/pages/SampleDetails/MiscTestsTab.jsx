import React from "react";
import { InfoGrid, Info } from "./SharedComponents";

export default function MiscTestsTab({ misc }) {
  if (!misc) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Miscellaneous Microbiology Tests</h2>

      <InfoGrid>
        <Info label="Pathogen" value={misc?.antibacterialAssay?.pathogen} />
        <Info label="Method" value={misc?.antibacterialAssay?.method} />
        <Info label="Antimalarial Assay" value={misc?.antibacterialAssay?.antimalarialAssay} />
        <Info label="Molecular ID" value={misc?.antibacterialAssay?.molecularId} />

        <Info label="Catalase" value={misc?.biochemicalTests?.catalase ? "Yes" : "No"} />
        <Info label="Oxidase" value={misc?.biochemicalTests?.oxidase ? "Yes" : "No"} />
        <Info label="Urease" value={misc?.biochemicalTests?.urease ? "Yes" : "No"} />
        <Info label="Gelatin Hydrolysis" value={misc?.biochemicalTests?.gelatinHydrolysis ? "Yes" : "No"} />
        <Info label="Sulfide Production" value={misc?.biochemicalTests?.sulfideProduction ? "Yes" : "No"} />
        <Info label="Nitrate Reduction" value={misc?.biochemicalTests?.nitrateReduction ? "Yes" : "No"} />
        <Info label="Fermentation" value={misc?.biochemicalTests?.fermentation ? "Yes" : "No"} />
        <Info label="Indole" value={misc?.biochemicalTests?.indole ? "Yes" : "No"} />
        <Info label="Citrate" value={misc?.biochemicalTests?.citrate ? "Yes" : "No"} />

        <Info label="Enzymatic Tests" value={misc?.enzymaticTests ? Object.keys(misc.enzymaticTests).filter(k => misc.enzymaticTests[k]).join(", ") || "-" : "-"} />
        <Info label="Notes" value={misc?.testNotes} />
      </InfoGrid>
    </div>
  );
}
