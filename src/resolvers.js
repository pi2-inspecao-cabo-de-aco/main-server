import processFile from './queries/process-file'

export default {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    ...processFile
  }
}
