const express = require('express');
const mediaRouter = express.Router({mergeParams: true});
const mediaController = require('../../controllers/v1/mediaController');
const Verify = require('../../controllers/v1/verify');
const conf = require('../../config');

const multer = require('multer');
const storage = require('multer-gridfs-storage')({
  url: conf.db.url
});
const upload = multer({storage: storage});

mediaRouter.route('/')
  .get(mediaController.getAllMediaFiles)
  .post(Verify.verifyOrdinaryUser, upload.single('mediaFile'), mediaController.createNewMediaFile);

mediaRouter.route('/:mediaId')
  .get(mediaController.getMediaFileById)
  .put(Verify.verifyOrdinaryUser, mediaController.updateMediaFile)
  .delete(Verify.verifyOrdinaryUser, mediaController.removeMediaFile);

module.exports = mediaRouter;
