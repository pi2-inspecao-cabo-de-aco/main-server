import nodeZip from 'node-zip'
import fsx from 'fs-extra'
import Path from 'path'
import unzip from 'unzipper'
import { exec } from 'child_process'
import util from 'util'

async function unzipFile (filename) {
  let path = Path.join(__dirname, '../public', filename)
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
    let files = await fsx.readdir(folder)
    let promises = []
    let imagesToMerge = []
    let lastImage
    let imageFiles = files.filter(f => f.match(/png|jpeg/i))

    // Executing python script to cocatenate images
    let pythonScript = Path.resolve(__dirname, './lib/concat-images.py')
    let execPromise = util.promisify(exec)
    let { stdout, stderr } = await execPromise(`python3 ${pythonScript} ${folder}`)
    if (stderr) {
      throw new Error(`------> Erro inesperado ao gerar imagem concatenada: ${stderr} <------`)
    }
  }
}

infoControll().then()

export {
  infoControll
}
