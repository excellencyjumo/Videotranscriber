const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const supabase = require('../utils/db');
const transcriber = require('../transcribe/index');

// Directory for storing uploaded videos
const uploadDirectory = path.join(__dirname, '..', 'utils');

// Create a multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Create a new multer instance
const upload = multer({ storage });

// Define an endpoint to handle video uploads
router.post('/', upload.single('video'), async (req, res) => {
  try {
    // Ensure that a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Store the URL in your Supabase database
    const { data, error } = await supabase
      .from('Videos').insert([{ path: req.file.path, file: req.file.originalname }]);

    if (error) {
      console.error('Error storing video in database:', error.message);
      return res.status(500).json({ error: 'Failed to store video' });
    }

    // Trigger transcription after storing the video
    try {
      const transcript = await transcriber(req.file.path);

        const { data, error } = await supabase
          .from('Videos').update({ transcript: transcript }).eq('file', req.file.originalname);

        res.status(200).json({ success: true, message: 'Video uploaded, stored, and transcribed' }
        );
    } catch (error) {
      console.error('Error during transcription:', error);
      res.status(500).json({ error: 'Failed to transcribe video' });
    }
  } catch (error) {
    console.error('Error uploading video:', error.message);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Videos').select('file');

    if (error) {
      console.error('Error getting videos from database:', error.message);
      return res.status(500).json({ error: 'Failed to get videos' });
    }

    const videos = data.map(video => video.file)

    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error('Error getting videos:', error.message);
    res.status(500).json({ error: 'Failed to get videos' });
  }
});

// get a specific video from supabase
router.get('/:filename', async (req, res) => {
  try {
    const filePath = path.join(uploadDirectory, req.params.filename);

    // Ensure that the file exists
    if (fs.existsSync(filePath)) {
      // set the appropriate content type
      res.setHeader('Content-Type', 'video/mp4');

      // Stream the video to the client
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    console.error('Error getting video:', err.message);
    res.status(500).json({ error: 'Failed to get video' });
  }
});

router.get('/transcript/:filename', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Videos').select('transcript').eq('file', req.params.filename);

    if (error) {
      console.error('Error getting transcript from database:', error.message);
      return res.status(500).json({ error: 'Failed to get transcript' });
    }

    const transcript = data[0].transcript;

    res.status(200).json({ success: true, data: transcript });
  } catch (error) {
    console.error('Error getting transcript:', error.message);
    res.status(500).json({ error: 'Failed to get transcript' });
  }
});
 
module.exports = router;
