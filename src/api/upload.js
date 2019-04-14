import express from 'express'
import multer from 'multer'
import Path from 'path'
import uuid from 'uuid/v4'

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, Path.join(__dirname, '../../public/'))
  },
  filename: function (req, file, cb) {
    console.log(file)
    cb(null, uuid() + '.png')
  }
})

const upload = multer({ storage })

export default () => {
  let router = express.Router()

  router.post('/', upload.any(), async (req, res) => {
    let { files } = req
    let file = files && files[0]
    let resObject = {
      success: true,
      filename: ''
    }
    if (file) {
      resObject.filename = file.filename
    } else {
      resObject.success = false
    }

    res.send(resObject)
  })

  return router
}
