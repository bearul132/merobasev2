// src/pages/Step4_Molecular.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSampleFormContext } from '../../context/SampleFormContext';
import { FileDropzone } from '../../components/FileDropzone';
import StepNavigation from '../../components/StepNavigation';
import FormProgressBar from '../../components/FormProgressBar';

export default function Step4_Molecular() {
  const { formData, updateSection } = useSampleFormContext();
  const navigate = useNavigate();
  const mol = formData.molecular;

  const setGel = (file) => updateSection('molecular', { gelPhoto: file ? file.data : null });
  const setSeqs = (files) =>
    updateSection('molecular', { seqFiles: Array.isArray(files) ? files : files ? [files] : [] });

  return (
    <div>
      <FormProgressBar step={4} steps={6} />
      <h3 className="font-semibold mb-2">Molecular Metadata</h3>
      <div className="grid gap-4">

        {/* Gel Image */}
        <div>
          <label className="block mb-1">Gel Image</label>
          <FileDropzone
            multiple={false}
            accept="image/*"
            onFiles={setGel}
            existing={mol.gelPhoto ? [{ name: 'gel' }] : []}
          />
          {mol.gelPhoto && <img src={mol.gelPhoto} className="mt-2 w-40 h-28 object-cover rounded" />}
        </div>

        {/* Sequence Files */}
        <div>
          <label className="block mb-1">Sequence Files (optional)</label>
          <FileDropzone
            multiple={true}
            accept=".fastq,.fq,.ab1,.txt,.fasta,.fa"
            onFiles={setSeqs}
            existing={mol.seqFiles}
          />
        </div>

        {/* Sample Preparation */}
        <div>
          <label className="block mb-1">Extraction Method</label>
          <select
            value={mol.extractionMethod || ''}
            onChange={(e) => updateSection('molecular', { extractionMethod: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Extraction Method</option>
            <option value="Phenol-Chloroform">Phenol-Chloroform</option>
            <option value="CTAB">CTAB</option>
            <option value="Kit-based">Kit-based</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Preservation Method</label>
          <select
            value={mol.preservation || ''}
            onChange={(e) => updateSection('molecular', { preservation: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Preservation Method</option>
            <option value="Ethanol 70%">Ethanol 70%</option>
            <option value="RNAlater">RNAlater</option>
            <option value="Frozen -20°C">Frozen -20°C</option>
            <option value="Frozen -80°C">Frozen -80°C</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Tissue Type</label>
          <select
            value={mol.tissueType || ''}
            onChange={(e) => updateSection('molecular', { tissueType: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Tissue Type</option>
            <option value="Muscle">Muscle</option>
            <option value="Gill">Gill</option>
            <option value="Leaf">Leaf</option>
            <option value="Coral Polyp">Coral Polyp</option>
            <option value="Whole Organism">Whole Organism</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Extraction Kit Used</label>
          <select
            value={mol.extractionKit || ''}
            onChange={(e) => updateSection('molecular', { extractionKit: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Kit</option>
            <option value="Qiagen">Qiagen</option>
            <option value="Zymo">Zymo</option>
            <option value="Macherey-Nagel">Macherey-Nagel</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* PCR / Amplification */}
        <div>
          <label className="block mb-1">Polymerase Type</label>
          <select
            value={mol.polymerase || ''}
            onChange={(e) => updateSection('molecular', { polymerase: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Polymerase</option>
            <option value="Taq">Taq</option>
            <option value="Pfu">Pfu</option>
            <option value="Phusion">Phusion</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Target Gene / Marker</label>
          <select
            value={mol.targetGene || ''}
            onChange={(e) => updateSection('molecular', { targetGene: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Marker</option>
            <option value="COI">COI</option>
            <option value="16S rRNA">16S rRNA</option>
            <option value="18S rRNA">18S rRNA</option>
            <option value="ITS">ITS</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">PCR Additives</label>
          <select
            value={mol.pcrAdditives || ''}
            onChange={(e) => updateSection('molecular', { pcrAdditives: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Additive</option>
            <option value="DMSO">DMSO</option>
            <option value="BSA">BSA</option>
            <option value="Betaine">Betaine</option>
            <option value="None">None</option>
          </select>
        </div>

        {/* Sequencing */}
        <div>
          <label className="block mb-1">Sequencing Platform</label>
          <select
            value={mol.sequencingPlatform || ''}
            onChange={(e) => updateSection('molecular', { sequencingPlatform: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Platform</option>
            <option value="Sanger">Sanger</option>
            <option value="Illumina">Illumina</option>
            <option value="Nanopore">Nanopore</option>
            <option value="PacBio">PacBio</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Library Prep Method</label>
          <select
            value={mol.libraryPrep || ''}
            onChange={(e) => updateSection('molecular', { libraryPrep: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Library Prep</option>
            <option value="Standard PCR">Standard PCR</option>
            <option value="Amplicon Library">Amplicon Library</option>
            <option value="Shotgun">Shotgun</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Read Type</label>
          <select
            value={mol.readType || ''}
            onChange={(e) => updateSection('molecular', { readType: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Read Type</option>
            <option value="Single-end">Single-end</option>
            <option value="Paired-end">Paired-end</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Phylogenetic / Notes */}
        <div>
          <label className="block mb-1">Phylogenetic Description / Notes</label>
          <textarea
            value={mol.phyloDescription || ''}
            onChange={(e) => updateSection('molecular', { phyloDescription: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <StepNavigation backPath={'/add/step3'} nextPath={'/add/step5'} />
      </div>
    </div>
  );
}
