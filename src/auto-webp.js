import fs from "fs";
import path from "path";
import sharp from "sharp";
import chokidar from "chokidar";

// Input/output directories
const inputDir = "./images";
const outputDir = "./webp_images";

// Ensure output directory exists
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Convert image to WebP
const convertToWebP = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath, ext);

  if (![".jpg", ".jpeg", ".png"].includes(ext)) return;

  const outputPath = path.join(outputDir, `${fileName}.webp`);

  try {
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Converted: ${fileName}${ext} → ${fileName}.webp`);
  } catch (err) {
    console.error(`❌ Error converting ${fileName}${ext}:`, err.message);
  }
};

// Delete corresponding WebP when source is deleted
const deleteWebP = (filePath) => {
  const fileName = path.basename(filePath, path.extname(filePath));
  const webpPath = path.join(outputDir, `${fileName}.webp`);

  if (fs.existsSync(webpPath)) {
    fs.unlinkSync(webpPath);
    console.log(`[${new Date().toLocaleTimeString()}] 🗑️ Deleted: ${fileName}.webp`);
  }
};

// Watch the input directory
chokidar.watch(inputDir, { persistent: true, ignoreInitial: false, awaitWriteFinish: true })
  .on("add", convertToWebP)
  .on("change", convertToWebP)
  .on("unlink", deleteWebP)
  .on("error", (err) => console.error("⚠️ Watcher error:", err));

console.log(`👀 Watching "${inputDir}" for image changes...`);
console.log(`✨ Converted files will appear in "${outputDir}"`);
