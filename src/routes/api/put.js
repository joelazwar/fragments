// src/routes/api/put.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Create a fragment for current user
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params['id']);

    if (fragment.type !== req.headers['content-type']) {
      res.set('Content-Type', 'application/json');
      res
        .status(400)
        .json(createErrorResponse(400, "A fragment's type can not be changed after it is created"));
    } else {
      await fragment.setData(req.body);

      await fragment.save();

      res
        .status(201)
        .location(`${process.env.API_URL}v1/fragments/${fragment.id}`)
        .json(
          createSuccessResponse({
            fragment: fragment,
          })
        );
    }
  } catch (err) {
    res.set('Content-Type', 'application/json');
    res.status(404).json(createErrorResponse(404, err.message));
  }
};
