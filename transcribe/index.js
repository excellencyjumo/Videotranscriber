const fs = require('fs');
const { execSync: exec } = require('child_process');
const { Deepgram } = require('@deepgram/sdk');
const ffmpeg = require('ffmpeg-static');
require('dotenv').config();

// Deepgram Instance
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

function ffmpeg(command) {
    return exec(`${ffmpeg} ${command}`)
}

async function transcriber(filePath) {
  // Extracting the audio from video using FFmpeg
  ffmpeg(`-hide_banner -y -i ${filePath} ${filePath}.wav`)

  const audioFile = {
    buffer: fs.readFileSync(`${filePath}.wav`),
    mimetype: 'audio/wav',
  }

  const response = await deepgram.transcription.preRecorded(audioFile, {
    punctuation: true,
  })
  
  return response.results;
}

module.exports = transcriber;
