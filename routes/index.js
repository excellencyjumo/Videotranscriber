const express = require('express');
const multer = require('multer');
const path = require('path');
const supabase = require('../utils/db');
const transcriber = require('../transcribe');

const router = express.Router();
const uploadDirectory = path.join(__dirname, '..', 'utils');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { data: _insertData, error: insertError } = await supabase
      .from('Videos')
      .insert([{ path: req.file.path, file: req.file.originalname }]);
        
      if (insertError) {
      console.error('Error storing video in database:', insertError.message);
      return res.status(500).json({ error: 'Failed to store video' });
    }

    try {
      // Transcribe the audio
      const transcript = await transcriber(req.file.path);
      
      console.log("OVER HERE",transcript);
     
      // Update the 'transcript' column in your database
      await supabase
        .from('Videos')
        .update({ transcript: transcript })
        .eq('file', req.file.originalname);

      res.status(200).json({ success: true, message: 'Video uploaded, stored, and transcribed' });
    } catch (transcriptionError) {
      console.error('Error during transcription:', transcriptionError);
      res.status(500).json({ error: 'Failed to transcribe video' });
    }    
  } catch (uploadError) {
    console.error('Error uploading video:', uploadError.message);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});


router.get('/:filename', async (req, res) => {
  try {
    const { data: transcriptData, error: transcriptError } = await supabase
      .from('Videos')
      .select('transcript')
      .eq('file', req.params.filename);

    if (transcriptError) {
      console.error('Error getting transcript from database:', transcriptError.message);
      return res.status(500).json({ error: 'Failed to get transcript' });
    }
    
    console.log("DATAAAAAAAAAAA",transcriptData);

    const transcript = transcriptData[0].transcript;

    res.status(200).json({ success: true, data: transcript });
  } catch (transcriptFetchError) {
    console.error('Error getting transcript:', transcriptFetchError.message);
    res.status(500).json({ error: 'Failed to get transcript' });
  }
});

module.exports = router;
