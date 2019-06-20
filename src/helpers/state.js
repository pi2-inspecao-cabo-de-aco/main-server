let state = {
  pubsub: null,
  currentCable: null,
  currentReport: null
}

async function setCable (cable) {
  state.currentCable = cable
}

async function setReport (report) {
  state.currentReport = report
}

async function setPubSub (pubsub) {
  state.pubsub = pubsub
}

export {
  state,
  setCable,
  setReport,
  setPubSub
}
