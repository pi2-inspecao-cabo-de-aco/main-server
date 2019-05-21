import nodeZip from 'node-zip'
import fsx from 'fs-extra'
import Path from 'path'
import unzip from 'unzipper'
import { exec } from 'child_process'
import util from 'util'
import { createAnalysis } from './helpers/analysis'

async function unzipFile (filename) {
  let path = Path.resolve(__dirname, '../public', filename)
  let folder = path.replace('.zip', '')
  await fsx.ensureDir(folder)
  await fsx.createReadStream(path)
  .pipe(
    unzip.Extract({ path: folder })
  )
  return folder
}

async function infoControll (filename = '1557707265663-1.zip') {
  if (filename) {
    let folder = await unzipFile(filename)

    // Executing python script to cocatenate images
    let pythonScript = Path.resolve(__dirname, './lib/concat-images.py')
    let execPromise = util.promisify(exec)
    let { stdout, stderr } = await execPromise(`python3 ${pythonScript} ${folder}`)
    if (stderr) {
      throw new Error(`------> Erro inesperado ao gerar imagem concatenada: ${stderr} <------`)
    }
    // TODO: use image size to calculate poitionStart and positionEnd
    await createAnalysis({ positionStart: 0, positionEnd: 500, image_path: folder + '/merged-image.png' })
  }
}

infoControll().then()

export {
  infoControll
}
