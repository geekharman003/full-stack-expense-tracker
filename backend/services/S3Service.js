const AWS = require("aws-sdk");

// upload the expenses in s3 bucket
const uploadToS3 = async (user,data, filename) => {
  let s3Bucket = new AWS.S3({
    accessKeyId: process.env.IAM_USER_ACCESS_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET_KEY,
  });

  // defines the bucket configuration
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${filename}${user.id}/${new Date()}.txt`,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((res, rej) => {
    // upload to bucket
    s3Bucket.upload(params, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(data.Location);
      }
    });
  });
};

module.exports = { uploadToS3 };
