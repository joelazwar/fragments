// src/routes/api/delete.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * Get fragment by metadata Id and display raw data
 */
module.exports.id = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params['id']);

    logger.debug({ fragment }, `returns after query to database`);
    
    Fragment.delete(fragment.ownerId, fragment.id);

    res.set('Content-Type', 'application/json');
    res.status(200).json(createSuccessResponse());
  } catch (err) {
    res.set('Content-Type', 'application/json');
    res.status(404).json(createErrorResponse(404, err.message));
  }
};
