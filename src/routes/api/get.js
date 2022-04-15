// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
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

      if (type === 'text/plain') {
        if (ext === 'txt') {
          res.set('Content-Type', fragment.mimeType);
          res.status(200).send(data);
        } else throw new Error("'text/plain' fragments can only be converted to '.txt'");
      }

      if (type === 'text/markdown') {
        if (ext === 'md') {
          res.set('Content-Type', fragment.mimeType);
          res.status(200).send(data);
        } else if (ext === 'txt') {
          res.set('Content-Type', 'text/plain');
          res.status(200).send(data);
        } else if (ext === 'html') {
          var md = require('markdown-it')();
          res.set('Content-Type', 'text/html');
          res.status(200).send(md.render(data.toString()));
        } else
          throw new Error(
            "'text/markdown' fragments can only be converted to '.md', '.html', '.txt'"
          );
      }

      if (type === 'text/html') {
        if (ext === 'html') {
          res.set('Content-Type', fragment.mimeType);
          res.status(200).send(data);
        } else if (ext === 'txt') {
          res.set('Content-Type', 'text/plain');
          res.status(200).send(data);
        } else throw new Error("'text/html' fragments can only be converted to '.html', '.txt'");
      }

      if (type === 'application/json') {
        if (ext === 'json') {
          res.set('Content-Type', fragment.mimeType);
          res.status(200).send(data);
        } else if (ext === 'txt') {
          res.set('Content-Type', 'text/plain');
          res.status(200).send(data);
        } else
          throw new Error("'application/json' fragments can only be converted to '.json', '.txt'");
      }
    } else {
      res.set('Content-Type', fragment.mimeType);
      res.status(200).send(data);
    }
  } catch (err) {
    res.set('Content-Type', 'application/json');
    res.status(404).json(createErrorResponse(404, err.message));
  }
};
