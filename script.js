import Path from 'path'
import { exec } from 'child_process'
import util from 'util'
import fsx from 'fs-extra'


async function infoControll () {
  const LOCAL_PATH = '/home/vitor/Projects/unb/pi2/main-server/public/'
  let newFilename = '32.zip'
  let renamedFile = `${Date.now()}-${(parseInt(newFilename.replace('.zip', '')) / 32)}.zip`
  let filepath = LOCAL_PATH + renamedFile
  console.log(filepath)
}

infoControll().then().catch()
