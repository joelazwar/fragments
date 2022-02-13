// src/routes/api/get.js

const { createSuccessResponse } = require('../../response');
const Fragment = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports.getList = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  res.status(200).json(
    createSuccessResponse({
      fragments: Fragment.byUser(req.user),
    })
  );
};

/**
 * Get a list of fragments by metadata Id
 */
module.exports.getId = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  res.status(200).json(
    createSuccessResponse({
      fragments: Fragment.byId(req.user, req.params.id),
    })
  );
};
