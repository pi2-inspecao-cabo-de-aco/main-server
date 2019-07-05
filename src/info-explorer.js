  import fsx from 'fs-extra'
import Path from 'path'
import unzip from 'unzipper'
import { exec } from 'child_process'
import util from 'util'
import { createAnalysis } from './helpers/analysis'
import { state } from './helpers/state'
import readline from 'readline'
import fs from 'fs'

const DISPLACEMENT = 50 // 50 means 5cm on real life
const SENSOR_ERROR_VALUE = 20

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

async function checkCableState (PATH) {
  return new Promise((resolve, reject) => {
    let lines = fs.readFileSync(PATH).toString().split("\n")
    var sensorValuesArray = new Array(lines[0].split(',').length).fill(null).map(()=> ([0, 10000]))
    let rl = readline.createInterface({
      input: fsx.createReadStream(PATH)
    })
    let cableState = 'Normal'
    let damageCount = 0
    rl.on('line', (line) => {
      let values = line.split(',')
      // console.log('LINE ----------------');
      // console.log(values);
      for (let i = 0; i < values.length; i++) {
        if(sensorValuesArray[i][0] < values[i]) {
          sensorValuesArray[i][0] = values[i]
        } 
        if(sensorValuesArray[i][1] > values[i]) {
          sensorValuesArray[i][1] = values[i]
        }
      } 
    })
    rl.on('close', () => {
      // console.log('valor dos sensores ----------------');
      // console.log(sensorValuesArray);
      // Averages:
      // - <= 3: Normal
      // - > 1 <= 5: Danificado
      // - > 5: Muito danificado
      for (let i = 0; i < sensorValuesArray.length; i++) {
        sensorValuesArray.map((nums) => {
          if (nums[0] - nums[1] > 500) {
            damageCount+=1
          }
        })
      }
      if (damageCount > 0 && damageCount <= 5) {
        cableState = 'Danificado'
      } else if (damageCount > 5) {
        cableState = 'Muito danificado'
      }
      console.log('VALOR DO DAMAGE -----------------');
      console.log(damageCount);
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
    let splits = treatedFilename.split('-')
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
    await createAnalysis({ ...position, image_path: folder + '/merged-image.png', cableState })
  }
}

export {
  infoControll
}
