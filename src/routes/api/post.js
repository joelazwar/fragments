// src/routes/api/post.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Create a fragment for current user
 */
module.exports = async (req, res) => {
  if (!Buffer.isBuffer(req.body) || req.body == {})
    res.status(415).json(createErrorResponse(415, 'Invalid type: Not Supported'));
  else {
    const fragment = new Fragment({ ownerId: req.user, type: req.headers['content-type'] });

    await fragment.setData(req.body);

    await fragment.save();

    res
      .status(201)
      .location(`${process.env.API_URL}/v1/fragments/${fragment.id}`)
      .json(
        createSuccessResponse({
          fragment: fragment,
        })
      );
  }
};
