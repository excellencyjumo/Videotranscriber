# Video Upload and Transcription API

Welcome to the Video Upload and Transcription API! This API empowers users to upload videos, securely store them on disk, manage filepaths in a database, transcribe the videos, and retrieve both video and transcription data. Below, you'll find essential information to get started.

## Deployed Host

**URL:** `https://videotranscriber.onrender.com`

## Endpoints

### Upload a Video

- **Endpoint:** `POST /extension/`
- **Description:** Upload a video file to the server.
- **Request Body:** Use a `multipart/form-data` request with a file named "video."
- **Response:** Receives a JSON object containing a success message upon a successful upload and transcription, or an error message if any step encounters an issue.

### Get Transcription of a Video

- **Endpoint:** `GET /extension/transcript/:filename`
- **Description:** Retrieve the transcription of a specific video from the Supabase database.
- **Parameters:**
  - `filename` (string): The name of the video file to retrieve the transcription for.
- **Response:** Returns a JSON object containing the transcription data if available.

## Usage

To use this API effectively, follow these steps:

1. Start the server.
2. Use Postman or any apk you prefer to interact with the API endpoints.

## Dependencies

This API relies on the following technologies and libraries:

- **Express.js**: A web application framework.
- **Multer**: Middleware for handling the file uploads.
- **Supabase**: A database service for storing video metadata and transcriptions.
- **Deepgram**: A service or library for video transcription (not included in this code).

## Configuration

Before running the API, you must configure your Supabase database credentials and the transcription service. Ensure you've set up the necessary environment variables and provided any required configuration details.

## Error Handling

This API provides comprehensive error responses, complete with detailed error messages for various scenarios. 

