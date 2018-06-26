const Media = require('../../models/media');
const mongoose      = require('mongoose');
const conf = require('../../config');
const Grid = require("gridfs-stream");

const conn          = mongoose.connection;
Grid.mongo        = mongoose.mongo;

/**
 * @swagger
 * definitions:
 *   NewMediaFile:
 *     type: object
 *     required:
 *       - firstName
 *       - lastName
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *   MediaFile:
 *     allOf:
 *       - $ref: '#/definitions/NewMediaFile'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 *           createdAt:
 *             type: string
 *             format: date
 *           updatedAt:
 *             type: string
 *             format: date
 */

/**
 * @swagger
 * /media:
 *   get:
 *     tags:
 *       - Media
 *     description: Returns all media files
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of mediafile objects
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/MediaFile'
 */
module.exports.getAllMediaFiles = function (req, res, next) {
  Media.find().then((media) => {
    res.json(media);
  }).catch(next);
};

/**
 * @swagger
 * /media/:
 *   post:
 *     tags:
 *       - Media
 *     description: Saves a media file
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: mediaFile
 *         in: formData
 *         type: file
 *         description: Add the media file with the key "mediaFile".
 *         required: true
 *       - name: metadata
 *         in: formData
 *         type: string
 *         description: Add metadata to the mediafile as JSON.
 *     responses:
 *       201:
 *         description: Successfully saved the mediafile
 */
module.exports.createNewMediaFile = function (req, res, next) {
  const media = {
    gridfsId: req.file.id,
    mimetype: req.file.mimetype,
    filename: req.file.filename,
    originalname: req.file.originalname,
    metaData: req.body,
    user: req.decoded._id
  };
  
  if (req.body.type) {
    media.type = req.body.type
  }
  
  Media.create(media).then((media) => {
    media.url = conf.url + '/api/v1/media/' + media._id;
    media.save().then((m) => {
      res.status(201).json({
        status: 'Mediafile saved!',
        success: true,
        media: m
      });
    }).catch(next);
  }).catch(next);
};

/**
 * @swagger
 * /media/{mediaId}:
 *   get:
 *     tags:
 *       - Media
 *     description: Returns a specific media file
 *     parameters:
 *       - name: mediaId
 *         in: path
 *         description: The ID of a media file
 *         required: true
 *         type: string
 *     produces:
 *       - file
 */
module.exports.getMediaFileById = function (req, res, next) {
  Media.findById(req.params.mediaId, function (err, media) {
    if (err) throw err;
    const gfs = Grid(conn.db);
    
    let readstream = gfs.createReadStream({
      _id: media.gridfsId
    });
    
    readstream.on('error', function (err) {
      console.log('An error occurred!', err);
      next(err);
    });
    
    readstream.pipe(res);
  });
};

/**
 * @swagger
 * /media/{mediaId}:
 *   put:
 *     tags:
 *       - Media
 *     description: Updates a specific media object
 *     parameters:
 *       - name: mediaId
 *         in: path
 *         description: The ID of a player
 *         required: true
 *         type: string
 *       - name: media
 *         description: Media object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewMediaFile'
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the dataset
 *         schema:
 *           $ref: '#/definitions/MediaFile'
 */
module.exports.updateMediaFile = function (req, res, next) {
  //todo: update media file
};

/**
 * @swagger
 * /media/{mediaId}:
 *   delete:
 *     tags:
 *       - Media
 *     description: Deletes a specific media object
 *     parameters:
 *       - name: mediaId
 *         in: path
 *         description: The ID of a media object
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: OK
 *         schema:
 *           $ref: '#/definitions/MediaFile'
 */
module.exports.removeMediaFile = function (req, res, next) {
  //todo: remove media file
};