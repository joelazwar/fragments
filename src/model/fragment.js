// Use https://www.npmjs.com/package/nanoid to create unique IDs
const { nanoid } = require('nanoid');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = [`text/`, `application/json`, `image/`];

class Fragment {
  constructor({
    id = nanoid(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    type,
    size = 0,
  }) {
    try {
      if (!ownerId) throw new Error('Owner Id is required');
      if (!type) throw new Error('Content Type is required');
      if (typeof size !== 'number') throw new Error('Size must be a number');
      if (size < 0) throw new Error('Size cannot be negative');
      if (!this.constructor.isSupportedType(type)) throw new Error('Type is not supported');
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }

    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  /**h
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    try {
      const data = await readFragment(ownerId, id);
      if (!data) throw new Error('Fragment id not found');
      return new Fragment({
        id: id,
        ownerId: ownerId,
        created: data.created,
        updated: data.updated,
        type: data.type,
        size: data.size,
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promisue
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if (!data) throw new Error('Fragment Data is required');

    this.updated = new Date().toISOString();
    this.size = Buffer.byteLength(data);
    return writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    return contentType.parse(this.type).type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return contentType.parse(this.type).type.includes('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return validTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    var returnVal = false;
    validTypes.forEach((a) => {
      if (contentType.parse(value).type.includes(a)) {
        returnVal = true;
      }
    });
    return returnVal;
  }
}

module.exports.Fragment = Fragment;
