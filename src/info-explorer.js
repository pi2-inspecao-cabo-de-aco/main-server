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
          if (nums[0] - nums[1] > 300) {
            damageCount+=1
          }
        })
      }
      if (damageCount <= 5) {
        cableState = 'Danificado'
      }
      console.log('VALOR DO DAMAGE -----------------');
      console.log(damageCount);
      resolve(cableState)
    })
  })
}

let sleep = (time) => new Promise((resolve, reject) => setTimeout(resolve, time || 10000))

async function infoControll (filename = '1557707265663-1.zip') {
  if (filename && filename.includes('.zip')) {
    let folder = await unzipFile(filename)

    await sleep(5000)
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

    const SENSORS_REPORT_PATH = Path.resolve(folder, 'data.txt')
    let cableState = await checkCableState(SENSORS_REPORT_PATH)
    await createAnalysis({ ...position, image_path: '/public/' + renamedFolder + '/merged-image.png', cableState })
  }

  if (filename && filename.includes('.txt')) {
    state.pubsub.publish('endCable', { endCable: true })
  }
}

export {
  infoControll
}
