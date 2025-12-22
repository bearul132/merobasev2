// src/pages/Step4_Molecular.jsx
import React from 'react';
import { useSampleFormContext } from '../../context/SampleFormContext';
import { FileDropzone } from '../../components/FileDropzone';
import StepNavigation from '../../components/StepNavigation';
import FormProgressBar from '../../components/FormProgressBar';

export default function Step4_Molecular() {
  const { formData, updateSection } = useSampleFormContext();

  // ================= SAFE DEFAULTS =================
  const mol = {
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
    phylogeneticNotes: '',

    ...formData.molecular
  };

  // ================= FILE HANDLERS =================
  const setGelImage = (file) =>
    updateSection('molecular', {
      gelImage: file ? file.data : null
    });

  const setRawSequences = (files) =>
    updateSection('molecular', {
      rawSequenceFiles: Array.isArray(files)
        ? files
        : files
        ? [files]
        : []
    });

  // ================= RENDER =================
  return (
    <div className="container mx-auto p-4">
      <FormProgressBar step={4} steps={6} />
      <h3 className="font-semibold mb-4">Molecular Data</h3>

      <div className="grid gap-6">

        {/* ================= GEL IMAGE ================= */}
        <section>
          <label className="block mb-1 font-medium">
            Gel Image (PCR / Electrophoresis)
          </label>
          <FileDropzone
            multiple={false}
            accept="image/*"
            onFiles={setGelImage}
            existing={mol.gelImage ? [{ name: 'gel-image' }] : []}
          />
          {mol.gelImage && (
            <img
              src={mol.gelImage}
              alt="Gel"
              className="mt-2 w-48 h-32 object-cover rounded border"
            />
          )}
        </section>

        {/* ================= RAW SEQUENCE FILES ================= */}
        <section>
          <label className="block mb-1 font-medium">
            RAW Sequence Files
          </label>
          <FileDropzone
            multiple={true}
            accept=".fastq,.fq,.ab1,.fasta,.fa"
            onFiles={setRawSequences}
            existing={mol.rawSequenceFiles}
          />
        </section>

        {/* ================= METADATA DROPDOWNS ================= */}
        {[
          [
            'markerGene',
            'Marker Gene / Target',
            ['COI', '16S rRNA', '18S rRNA', 'ITS', 'rbcL', 'matK', 'Other']
          ],
          [
            'dnaSource',
            'DNA Source',
            ['Isolate', 'Tissue', 'Whole Organism', 'Environmental DNA (eDNA)', 'Culture']
          ],
          [
            'extractionKit',
            'Extraction Kit Used',
            ['Qiagen', 'Zymo', 'Macherey-Nagel', 'Invitrogen', 'Other']
          ],
          [
            'extractionMethod',
            'DNA Extraction Method',
            ['CTAB', 'Phenol-Chloroform', 'Kit-based', 'Boiling', 'Other']
          ],
          [
            'primerSet',
            'Primer Set Used',
            [
              'LCO1490 / HCO2198',
              '27F / 1492R',
              'ITS1 / ITS4',
              '341F / 785R',
              'Other'
            ]
          ],
          [
            'pcrPlatform',
            'PCR Platform',
            ['Conventional PCR', 'qPCR', 'Digital PCR']
          ],
          [
            'pcrProtocol',
            'PCR Protocol Type',
            ['Standard PCR', 'Touchdown PCR', 'Nested PCR', 'Multiplex PCR']
          ],
          [
            'sequencingMethod',
            'Sequencing Method',
            ['Sanger', 'Illumina', 'Nanopore', 'PacBio']
          ],
          [
            'sequencingVendor',
            'Sequencing Vendor / Lab',
            [
              'Internal Laboratory',
              'Macrogen',
              'BGI',
              'Novogene',
              '1st BASE',
              'Other'
            ]
          ],
          [
            'sequencingQuality',
            'Sequencing Quality',
            ['Excellent', 'Good', 'Moderate', 'Poor', 'Failed']
          ],
          [
            'bioinformaticsPipeline',
            'Bioinformatics Pipeline',
            [
              'Manual BLAST',
              'QIIME2',
              'DADA2',
              'Mothur',
              'Custom Pipeline'
            ]
          ],
          [
            'accessionStatus',
            'Accession / Submission',
            [
              'Not submitted',
              'Submitted to GenBank',
              'Accession received',
              'BOLD submission'
            ]
          ],
          [
            'dnaConcentration',
            'DNA Concentration Range',
            [
              '< 5 ng/µL',
              '5–20 ng/µL',
              '20–50 ng/µL',
              '> 50 ng/µL'
            ]
          ]
        ].map(([key, label, options]) => (
          <div key={key}>
            <label className="block mb-1 font-medium">{label}</label>
            <select
              className="w-full p-2 border rounded"
              value={mol[key]}
              onChange={(e) =>
                updateSection('molecular', { [key]: e.target.value })
              }
            >
              <option value="">Select {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* ================= NOTES ================= */}
        <section>
          <label className="block mb-1 font-medium">
            Phylogenetic Description / Notes
          </label>
          <textarea
            className="w-full p-2 border rounded min-h-[120px]"
            value={mol.phylogeneticNotes}
            onChange={(e) =>
              updateSection('molecular', {
                phylogeneticNotes: e.target.value
              })
            }
          />
        </section>

        {/* ================= NAVIGATION ================= */}
        <StepNavigation backPath="/add/step3" nextPath="/add/step5" />
      </div>
    </div>
  );
}
