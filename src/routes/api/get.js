// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

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
    let fragment = new Fragment({ ownerId: req.user, type: 'text/plain' }); //placeholder values

    fragment = await Fragment.byId(req.user, req.params['id']);

    const data = await fragment.getData();

    if (req.params[0] === '/info') {
      res.set('Content-Type', 'application/json');
      res.status(200).json(createSuccessResponse({ fragment: fragment }));
    } else if (req.params[1]?.includes('.')) {
      //only support markdown to html conversion for now
      if (req.params[2] === 'html' && fragment.mimeType === 'text/markdown') {
        var md = require('markdown-it')();
        res.set('Content-Type', 'text/html');
        res.status(200).send(md.render(data.toString()));
      } else throw new Error(`${fragment.mimeType} to ${req.params[2]} conversion not supported`);
    } else {
      res.set('Content-Type', fragment.mimeType);
      res.status(200).send(data);
    }
  } catch (err) {
    res.set('Content-Type', 'application/json');
    res.status(404).json(createErrorResponse(404, err.message));
  }
};
