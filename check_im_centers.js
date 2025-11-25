import fs from 'fs';
const geoJson = JSON.parse(fs.readFileSync('./src/assets/150000_full.json', 'utf8'));

const missingCenter = geoJson.features.filter(f => !f.properties.center);
console.log("Features missing center:", missingCenter.length);
if (missingCenter.length > 0) {
  missingCenter.forEach(f => console.log(f.properties.name));
}

const hasCenter = geoJson.features.filter(f => f.properties.center);
console.log("Features with center:", hasCenter.length);
hasCenter.forEach(f => console.log(`${f.properties.name}: ${JSON.stringify(f.properties.center)}`));
