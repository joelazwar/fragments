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
    const id = req.params['id'];
    const ext = req.params['ext'];

    const fragment = await Fragment.byId(req.user, id);

    logger.debug({ fragment }, `returns after query to database`);

    const data = await fragment.getData();

    const type = fragment.mimeType;

    if (ext) {
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

module.exports.idInfo = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params['id']);

    logger.debug({ fragment }, `returns after query to database`);

    res.set('Content-Type', 'application/json');
    res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } catch (err) {
    res.set('Content-Type', 'application/json');
    res.status(404).json(createErrorResponse(404, err.message));
  }
};
