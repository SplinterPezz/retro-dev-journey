const BYTES_PER_MB = 1024 * 1024;

export const maxCvSizeMb: number = 5;
export const maxCvSizeBytes: number = maxCvSizeMb * BYTES_PER_MB;

// used when the browser cannot read the backend's Content-Disposition header (it is not exposed by CORS)
export const cvDownloadFilename: string = 'pezzati mauro cv.pdf';
