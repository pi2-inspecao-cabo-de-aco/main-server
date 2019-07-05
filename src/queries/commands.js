import { exec } from 'child_process'
import { resetBackup, watchFiles, removeInterval } from '../ftp-server'

export default {
  command: async (root, { command }, context, info) => {
    try {
      console.log('command=' + command)

      // 0: Stop
      // 1: Pause
      // 2: Left
      // 3: Right
      // 4: Start

      switch (parseInt(command)) {
        case 0:
          removeInterval()
          resetBackup()
          break
        case 4:
          await watchFiles()
      }

      // exec('gcc client_http.c -o client_http_prog', function (error, stdout, stderr) {
      exec(`./client_http_prog ${command}`, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout)
        console.log('stderr: ' + stderr)
        if (error !== null) {
          console.log('exec error: ' + error)
        }
      })
      return { 'command': command, 'status': 'success' }
    } catch (err) {
      throw new Error(err.message)
    }
  },
  downloadFolder: async (root, { step }, context, info) => {
    try {
      console.log('step=' + step)
      let terminalCommand = 'sshpass -p "ricas123" scp pi@192.168.4.1:/tmp/comp/' + step + '.tar /home/lucas/Documents/robo-cabos/main-server/public'
      // console.log('command=' + terminalCommand)
      exec(terminalCommand, function (error, stdout, stderr) {
        console.log('stdout: ' + stdout)
        console.log('stderr: ' + stderr)
        if (error !== null) {
          console.log('exec error: ' + error)
        }
      })
      return { 'step': step, 'download': 'success' }
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
