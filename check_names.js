import fs from 'fs';
const geoJson = JSON.parse(fs.readFileSync('./src/assets/100000_full.json', 'utf8'));

const innerMongoliaFeatures = geoJson.features.filter(f =>
  String(f.properties.adcode).startsWith('15') ||
  f.properties.province === '内蒙古自治区' ||
  f.properties.name.includes('内蒙古')
);

console.log("Found features:", innerMongoliaFeatures.length);
innerMongoliaFeatures.forEach(f => {
  console.log(`Name: ${f.properties.name}, Adcode: ${f.properties.adcode}, Province: ${f.properties.province}`);
});
