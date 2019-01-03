const fs = require('fs-extra');
const log = require('./helper/logger');
const path = require('./helper/path');
const run = require('./helper/run');

// Define cache folder
const cacheFolder = path.cache('dev');

// Empty cache folder
try {
  fs.emptyDirSync(cacheFolder);
  log.success('Emptied dev build cache folder.');
} catch (e) {
  log.error('Failed to empty dev build cache folder.');
}

// Update index.html file
if (run.script('update-index-file').code !== 0) process.exit(1);

// Update main.js file
if (run.script('update-main-file').code !== 0) process.exit(1);

// Build files
const parcelCacheFolder = path.cache('parcel');
log.warning('Building development files - this may take a while ...');
run.loud(`
  npx parcel "${path.cache('index.html')}"
  --cache-dir "${parcelCacheFolder}"
  --out-dir "${cacheFolder}"
  --open
`.replace(/\n/g, ' '));
