const cloudinary = require('cloudinary').v2;
const expressAsyncHandler = require('express-async-handler');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const uploadImage = expressAsyncHandler(async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // don't allow overwriting the asset with new versions
  //accept files other than images
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'image',
    flags: 'attachment',
  };

  // Upload the image
  const result = await cloudinary.uploader.upload(imagePath, options);
  console.log(result);
  return result;
});

const deleteImages = expressAsyncHandler(async (public_ids) => {
  const options = {
    resource_type: 'image',
  };

  const result = await cloudinary.api.delete_resources(public_ids, options);
  console.log(result);
  return result;
});

const deleteImage = expressAsyncHandler(async (public_id) => {
  const options = {
    resource_type: 'image',
  };

  const result = await cloudinary.uploader.destroy(public_id, options);
  console.log(result);
  return result;
});

module.exports = { uploadImage, deleteImages, deleteImage };
