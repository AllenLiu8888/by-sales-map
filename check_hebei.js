import fs from 'fs';
const geoJson = JSON.parse(fs.readFileSync('./src/assets/100000_full.json', 'utf8'));

const hebeiFeatures = geoJson.features.filter(f =>
  String(f.properties.adcode).startsWith('13')
);

console.log("Found Hebei features:", hebeiFeatures.length);
hebeiFeatures.forEach(f => {
  console.log(`Name: ${f.properties.name}, Adcode: ${f.properties.adcode}, Level: ${f.properties.level}`);
});
