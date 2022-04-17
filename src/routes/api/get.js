// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
const convert = require('../../utils/convert');
/**
 * Get a list of fragments for the current user
 */
module.exports.list = async (req, res) => {
  try {
    const fragments = await Fragment.byUser(req.user, req.query?.expand === '1');

    res.status(200).json(createSuccessResponse({ fragments: fragments }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};

/**
 * Get fragment by metadata Id and display raw data
 */
module.exports.id = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params['id']);

    logger.debug({ fragment }, `returns after query to database`);

    const data = await fragment.getData();

    const type = fragment.mimeType;

    if (req.params[0] === '/info') {
      res.set('Content-Type', 'application/json');
      res.status(200).json(createSuccessResponse({ fragment: fragment }));
    } else if (req.params[1]?.includes('.')) {
      const ext = req.params[2];
      const { newType, newData } = await convert(type, data, ext);
      res.set('Content-Type', newType);
      res.status(200).send(newData);
    } else {
      res.set('Content-Type', fragment.mimeType);
      res.status(200).send(data);
    }
  } catch (err) {
    res.set('Content-Type', 'application/json');
    res.status(404).json(createErrorResponse(404, err.message));
  }
};

// export const convertFragment = async (type, data, ext) => {
//   const defaultVal = { newType: type, newData: data };

//   if (type === 'text/plain') {
//     if (ext === 'txt') return defaultVal;
//     else throw new Error("'text/plain' fragments can only be converted to '.txt'");
//   }

//   if (type === 'text/markdown') {
//     if (ext === 'md') return defaultVal;
//     if (ext === 'txt') return { newType: 'text/plain', newData: data };
//     if (ext === 'html') return { newType: 'text/html', newData: md.render(data.toString()) };
//     else
//       throw new Error("'text/markdown' fragments can only be converted to '.md', '.html', '.txt'");
//   }

//   if (type === 'text/html') {
//     if (ext === 'html') return defaultVal;
//     if (ext === 'txt') return { newType: 'text/plain', newData: data };
//     else throw new Error("'text/html' fragments can only be converted to '.html', '.txt'");
//   }

//   if (type === 'application/json') {
//     if (ext === 'json') return defaultVal;
//     if (ext === 'txt') return { newType: 'text/plain', newData: data };
//     else throw new Error("'application/json' fragments can only be converted to '.json', '.txt'");
//   }

//   if (type.startsWith('image/')) {
//     if (ext == 'png') return { newType: 'image/png', newData: await sharp(data).png().toBuffer() };
//     if (ext == 'jpg') return { newType: 'image/jpg', newData: await sharp(data).jpeg().toBuffer() };
//     if (ext == 'webp')
//       return { newType: 'image/webp', newData: await sharp(data).webp().toBuffer() };
//     if (ext == 'gif') return { newType: 'image/gif', newData: await sharp(data).gif().toBuffer() };
//     else throw new Error(`${type} cannot be converted to .${ext}`);
//   }
// };
