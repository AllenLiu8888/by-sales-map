import fs from 'fs';
const geoJson = JSON.parse(fs.readFileSync('./src/assets/150000_full.json', 'utf8'));

if (geoJson.features.length > 0) {
  console.log("First feature properties:", JSON.stringify(geoJson.features[0].properties, null, 2));
}
