// // const { GcsFileUpload } = require("gcs-file-upload");
// const serviceKey = require("./serviceKey.json");
// // const myBucket = new GcsFileUpload({ keyFilename: serviceKey, projectId: serviceKey.project_id }, "john_bucket_demo");
// // module.exports = myBucket;

// const unggah = require('unggah')
// const storage = unggah.gcs({keyFileName:serviceKey,bucketName:'john_bucket_demo',rename:(req,file)=>`${Date.now()}-${file.originalname}`})
// const upload = unggah({
//     limits:{fileSize:1e15},storage
// })

// module.exports = upload
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({ keyFilename: "./config/serviceKey.json" });
const {bucketname} = require('config')

const uploadToBucket = async (file) => {
  const res = await storage.bucket(bucketname).upload(file.path, { destination: `${new Date().getTime()}-${file.originalname}` });
  const { id, name } = res[0].metadata;
  return { url: `https://storage.googleapis.com/${bucketname}/${name}`, id, name, originalname: file.originalname };
};

const deleteFromBucket = async (filename) => {
  const myBucket = storage.bucket(bucketname);
  const file = myBucket.file(filename);
  await file.delete();
  console.log("File deleted");
};

module.exports = { uploadToBucket, deleteFromBucket };
