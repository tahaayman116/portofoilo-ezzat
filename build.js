const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '_data');
const collections = ['experience', 'skills', 'certifications'];

collections.forEach(collection => {
    const collectionDir = path.join(dataDir, collection);
    if (!fs.existsSync(collectionDir)) {
        console.log(`Directory not found: ${collectionDir}, creating empty JSON array.`);
        fs.writeFileSync(path.join(dataDir, `${collection}.json`), '[]');
        return;
    }

    const files = fs.readdirSync(collectionDir);
    const data = files.map(file => {
        const content = fs.readFileSync(path.join(collectionDir, file), 'utf-8');
        return JSON.parse(content);
    });

    fs.writeFileSync(path.join(dataDir, `${collection}.json`), JSON.stringify(data, null, 2));
    console.log(`Successfully built ${collection}.json with ${data.length} items.`);
});
