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
      return { 'command': 'success' }
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
