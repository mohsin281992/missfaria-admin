import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const router = express.Router();

// POST upload single image file
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  let fileUrl = '';
  let filename = req.file.originalname;

  try {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(req.file.originalname) || '.png';
    filename = `img-${uniqueSuffix}${ext}`;
    const filePath = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(filePath, req.file.buffer);
    fileUrl = `/uploads/${filename}`;
  } catch (err) {
    console.warn('Could not write image to local disk (e.g. read-only serverless filesystem):', err.message);
  }

  // Fallback to Base64 Data URL if disk writing is read-only (e.g. Vercel)
  if (!fileUrl) {
    const base64Data = req.file.buffer.toString('base64');
    fileUrl = `data:${req.file.mimetype};base64,${base64Data}`;
  }

  res.json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

export default router;
