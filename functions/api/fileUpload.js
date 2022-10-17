const { bucket } = require("../util/admin");

exports.uploadProfilePicture = async (request, response, next) => {
  console.log("Attempting upload...");
  console.log(request.body, "request file");
  //   const { file } = request;
  //   bucket
  //     .upload(file)
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err, "Something went wrong.");
  //     });
  //   let file = request.file;
  //   let newFileName = `${file.originalname}_${Date.now()}`;
  //   let fileUpload = await bucket.upload(newFileName, file);
  //   const blobStream = await fileUpload.createWriteStream({
  //     metadata: {
  //       contentType: file.mimetype,
  //     },
  //   });
  //   blobStream.on("error", (err) => {
  //     console.log(err);
  //   });
  //   blobStream.on("finish", () => {
  //     const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
  //     return response.status(200).json({ profileUrl: url });
  //   });
  //   blobStream.end(file.buffer);
  try {
    if (!request.file) {
      response.status(400).send("Error, could not upload file");
      return;
    }

    // Create new blob in the bucket referencing the file
    const blob = bucket.file(request.file.originalname);

    // Create writable stream and specifying file mimetype
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: request.file.mimetype,
      },
    });

    blobWriter.on("error", (err) => next(err));

    blobWriter.on("finish", () => {
      // Assembling public URL for accessing the file via HTTP
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(
        blob.name
      )}?alt=media`;

      // Return the file name and its public URL
      response.status(200).send({ fileName: request.file.originalname, fileLocation: publicUrl });
    });

    // When there is no more data to be consumed from the stream
    blobWriter.end(request.file.buffer);
  } catch (error) {
    response.status(400).send(`Error, could not upload file: ${error}`);
    return;
  }
};
