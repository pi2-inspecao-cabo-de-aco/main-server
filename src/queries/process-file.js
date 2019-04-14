export default {
  fileUpload: async (root, { filename }, context) => {
    console.log(filename)
    return filename
  }
}
