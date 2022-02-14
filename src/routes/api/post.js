// src/routes/api/post.js

const { createSuccessResponse } = require('../../response');
const Fragment = require('../../model/fragment');
const { hash } = require('../../../utils/hash');

/**
 * Create a fragment for current user
 */
module.exports = (req, res) => {
  const fragment = new Fragment({ ownerId: hash(req.user), type: 'text/plain' });

  fragment.save();

  // TODO: this is just a placeholder to get something working...
  res
    .status(201)
    .location(hash(`/v1/fragments/${req.user}`))
    .json(
      createSuccessResponse({
        fragments: [],
      })
    );
};
