import { exec } from 'child_process'

export default {
  command: async (root, { command }, context, info) => {
    try {
      console.log('command=' + command)
      let child = exec('gcc client_http.c -o client_http_prog', function (error, stdout, stderr) {
      // let child = exec('./client_http_prog', function (error, stdout, stderr) {
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
      let terminalCommand = 'sshpass -p "ricas123" scp pi@192.168.4.1:/tmp/comp/' + step + '.tar /home/lucas/Documents/unb/'
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
