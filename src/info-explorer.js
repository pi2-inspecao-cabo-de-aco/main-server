import fsx from 'fs-extra'
import Path from 'path'
import unzip from 'unzipper'
import { exec } from 'child_process'
import util from 'util'
import { createAnalysis } from './helpers/analysis'
import { state } from './helpers/state'
import readline from 'readline'

const DISPLACEMENT = 50 // 50 means 5cm on real life
const SENSOR_ERROR_VALUE = 20
let datetime

async function unzipFile (filename) {
  // 32.zip
  let filenameNumbers = filename.replace('.zip', '')
  let publicPath = Path.resolve(__dirname, '../public')
  // path/public
  let zipPath = Path.resolve(publicPath, filename)
  // path/public/32.zip
  datetime = Date.now()
  let renamedFolder = `${datetime}-${(parseInt(filenameNumbers) / 32)}`
  // 124124124-1
  let folder = Path.resolve(publicPath, renamedFolder)
  // path/public/121412414124-1
  await fsx.ensureDir(folder)
  await fsx.createReadStream(zipPath)
  .pipe(
    unzip.Extract({ path: folder })
  )
  return folder
}

async function checkCableState (PATH) {
  return new Promise((resolve, reject) => {
    let rl = readline.createInterface({
      input: fsx.createReadStream(PATH)
    })
    let cableState = 'Normal'
    let damageCount = 0
    rl.on('line', (line) => {
      let values = line.split(',')
      let intValues = Array.from(values, (v) => parseInt(v))
      let sum = intValues.reduce((a,b) => a + b)
      let average = Math.floor(sum / intValues.length)
      if (average <= SENSOR_ERROR_VALUE) {
        damageCount++
      }
    })
    rl.on('close', () => {
      // Averages:
      // - <= 3: Normal
      // - > 3 <= 5: Danificado
      // - > 5: Muito danificado
      if (damageCount > 3 && damageCount <= 5) {
        cableState = 'Danificado'
      } else if (damageCount > 5) {
        cableState = 'Muito danificado'
      }
      resolve(cableState)
    })
  })
}

async function infoControll (filename = '1557707265663-1.zip') {
  if (filename) {
    let folder = await unzipFile(filename)

    // Executing python script to cocatenate images
    const PYTHON_SCRIPT_PATH = Path.resolve(__dirname, './lib/concat-images.py')
    let execPromise = util.promisify(exec)
    let { stdout, stderr } = await execPromise(`python3 ${PYTHON_SCRIPT_PATH} ${folder}`)
    if (stderr) {
      throw new Error(`------> Erro inesperado ao gerar imagem concatenada: ${stderr} <------`)
    }
    // TODO: use image size to calculate poitionStart and positionEnd

    let treatedFilename = filename.replace('.zip', '') // remove .zip sufix
    let renamedFolder = `${datetime}-${(parseInt(treatedFilename) / 32)}`
    let splits = renamedFolder.split('-')
    let robotPosition = parseInt(splits[1])
    let place = robotPosition * DISPLACEMENT
    let position = {
      positionStart: place - DISPLACEMENT,
      positionEnd: place
    }
    if (splits.length === 3) { // check 'end' sufix
      if (splits[2] === 'end') {
        state.pubsub.publish('endCable', { endCable: place })
      }
    }

    const SENSORS_REPORT_PATH = Path.resolve(folder, 'data.txt')
    let cableState = await checkCableState(SENSORS_REPORT_PATH)
    await createAnalysis({ ...position, image_path: '/public/' + renamedFolder + '/merged-image.png', cableState })
  }
}

export {
  infoControll
}
