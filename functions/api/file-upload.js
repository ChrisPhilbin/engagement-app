const { Storage } = require("@google-cloud/storage");

exports.listAllFiles = (request, response) => {
  const storage = new Storage();

  const bucketName = "ng-blog-574e0.appspot.com";

  async function list() {
    const [files] = await storage.bucket(bucketName).getFiles();

    console.log("Files:");
    files.forEach((file) => {
      console.log(file.name);
    });
  }

  list().catch(console.error);
};
