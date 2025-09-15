// routes/sampleroutes.js
const express = require('express');
const router = express.Router();
const Sample = require('../models/sample');
const { Parser } = require('json2csv');
const multer = require('multer');
const path = require('path');

// ---------------- CSV EXPORT ----------------
router.get('/export/csv', async (req, res) => {
  try {
    const samples = await Sample.find();

    const fields = [
      'sampleId',
      'sampleName',
      'projectSample',
      'projectNumber',
      'sampleNumber',
      'kingdom',
      'family',
      'genus',
      'species',
      'dateAcquired',
      'coordinates',
      'image'
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(samples);

    res.header('Content-Type', 'text/csv');
    res.attachment('samples.csv'); // forces download
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- IMAGE UPLOAD ----------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // store inside /uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});

const upload = multer({ storage });

// Upload image for a sample by sampleId
router.post('/:sampleId/upload', upload.single('image'), async (req, res) => {
  try {
    const sample = await Sample.findOne({ sampleId: req.params.sampleId });
    if (!sample) return res.status(404).json({ error: 'Sample not found' });

    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

    // Save relative path
    sample.image = `/uploads/${req.file.filename}`;
    await sample.save();

    res.json({
      message: 'Image uploaded successfully',
      file: req.file,
      sample
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CRUD ----------------
// CREATE
router.post('/', async (req, res) => {
  try {
    const sample = new Sample(req.body);
    await sample.save();
    res.status(201).json(sample);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all
router.get('/', async (req, res) => {
  try {
    const samples = await Sample.find();
    res.json(samples);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH & FILTER
router.get('/search', async (req, res) => {
  try {
    const filters = { ...req.query };
    const query = {};

    if (filters.sampleName) query.sampleName = { $regex: filters.sampleName, $options: 'i' };
    if (filters.projectSample) query.projectSample = filters.projectSample;
    if (filters.projectNumber) query.projectNumber = parseInt(filters.projectNumber);
    if (filters.sampleNumber) query.sampleNumber = parseInt(filters.sampleNumber);
    if (filters.kingdom) query.kingdom = filters.kingdom;
    if (filters.family) query.family = filters.family;
    if (filters.genus) query.genus = filters.genus;
    if (filters.species) query.species = filters.species;

    const results = await Sample.find(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one
router.get('/:sampleId', async (req, res) => {
  try {
    const sample = await Sample.findOne({ sampleId: req.params.sampleId });
    if (!sample) return res.status(404).json({ message: 'Sample not found' });
    res.json(sample);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put('/:sampleId', async (req, res) => {
  try {
    const updatedSample = await Sample.findOneAndUpdate(
      { sampleId: req.params.sampleId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedSample) return res.status(404).json({ message: 'Sample not found' });
    res.json(updatedSample);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE one
router.delete('/:sampleId', async (req, res) => {
  try {
    const deleted = await Sample.findOneAndDelete({ sampleId: req.params.sampleId });
    if (!deleted) return res.status(404).json({ message: 'Sample not found' });
    res.json({ message: 'Sample deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- CLEANUP EMPTY SAMPLES ----------------
router.delete('/cleanup', async (req, res) => {
  try {
    // adjust condition: deletes samples with no sampleName OR completely empty
    const result = await Sample.deleteMany({
      $or: [
        { sampleName: { $exists: false } },
        { sampleName: '' },
        { projectSample: { $exists: false } }
      ]
    });
    res.json({ message: 'Empty samples removed', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
