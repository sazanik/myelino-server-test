const fetch = require('node-fetch');
const fs = require('fs');
const { pipeline } = require('stream');
const util = require('util');
const path = require('path');

const saveImage = async (imageUrl, imagePath) => {
  const response = await fetch(imageUrl);

  if (!response.ok)
    throw new Error(`Unexpected response: ${response.statusText}`);

  await util.promisify(pipeline)(response.body, fs.createWriteStream(imagePath));
};

const generateImage = async (width = 500, height = 500) => {
  const imageUrl = `https://picsum.photos/${width}/${height}`;
  const imagePath = path.join(__dirname, '../data/images', `randomImage${Math.random()}.jpg`);

  await saveImage(imageUrl, imagePath);

  console.log(`Random image saved at: ${imagePath}`);

  return imagePath;
};

module.exports = generateImage;
