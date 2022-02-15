// src/routes/api/get.js

const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

/**
 * Get a list of fragments for the current user
 */
module.exports.list = async (req, res) => {
  // TODO: this is just a placeholder to get something working...
  res.status(200).json(
    createSuccessResponse({
      fragments: await Fragment.byUser(req.user, req.query?.expand === '1'),
    })
  );
};

/**
 * Get fragment by metadata Id and display raw data
 */
module.exports.id = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    const data = await fragment.getData();

   res.set('Content-Type', fragment.mimeType); //Only supports plain text for now

    res.status(200).send(Buffer.from(data).toString('utf-8'));
  } catch (err){
    res.status(404).json(createErrorResponse(404, err));
  }
};
