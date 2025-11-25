import fs from 'fs';
const geoJson = JSON.parse(fs.readFileSync('./src/assets/150000_full.json', 'utf8'));

console.log("Found features:", geoJson.features.length);
geoJson.features.forEach(f => {
  console.log(`Name: ${f.properties.name}, Adcode: ${f.properties.adcode}`);
});
