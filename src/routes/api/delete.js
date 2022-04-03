// src/routes/api/delete.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get fragment by metadata Id and display raw data
 */
module.exports.id = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params['id']);

    Fragment.delete(fragment.ownerId, fragment.id);

    res.set('Content-Type', 'application/json');
    res.status(404).json(createSuccessResponse());
  } catch (err) {
    res.set('Content-Type', 'application/json');
    res.status(404).json(createErrorResponse(404, err.message));
  }
};
