// src/routes/api/post.js

const { createSuccessResponse } = require('../../response');
const Fragment = require('../../model/fragment');

/**
 * Create a fragment for current user
 */
module.exports = (req, res) => {
  // TODO: this is just a placeholder to get something working...
  res.status(200).json(
    createSuccessResponse({
      fragments: Fragment.byUser(req.user),
    })
  );
};
