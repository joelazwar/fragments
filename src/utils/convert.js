const sharp = require('sharp');
var md = require('markdown-it')();

module.exports = async (type, data, ext) => {
  const defaultVal = { newType: type, newData: data };

  if (type === 'text/plain') {
    if (ext === 'txt') return defaultVal;
    else throw new Error("'text/plain' fragments can only be converted to '.txt'");
  }

  if (type === 'text/markdown') {
    if (ext === 'md') return defaultVal;
    if (ext === 'txt') return { newType: 'text/plain', newData: data };
    if (ext === 'html') return { newType: 'text/html', newData: md.render(data.toString()) };
    else
      throw new Error("'text/markdown' fragments can only be converted to '.md', '.html', '.txt'");
  }

  if (type === 'text/html') {
    if (ext === 'html') return defaultVal;
    if (ext === 'txt') return { newType: 'text/plain', newData: data };
    else throw new Error("'text/html' fragments can only be converted to '.html', '.txt'");
  }

  if (type === 'application/json') {
    if (ext === 'json') return defaultVal;
    if (ext === 'txt') return { newType: 'text/plain', newData: data };
    else throw new Error("'application/json' fragments can only be converted to '.json', '.txt'");
  }

  if (type.startsWith('image/')) {
    if (ext == 'png') return { newType: 'image/png', newData: await sharp(data).png().toBuffer() };
    if (ext == 'jpg') return { newType: 'image/jpg', newData: await sharp(data).jpeg().toBuffer() };
    if (ext == 'webp')
      return { newType: 'image/webp', newData: await sharp(data).webp().toBuffer() };
    if (ext == 'gif') return { newType: 'image/gif', newData: await sharp(data).gif().toBuffer() };
    else throw new Error(`${type} cannot be converted to .${ext}`);
  }
};
