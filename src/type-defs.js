export default `
scalar DateTime

type File {
  filename: String!
  mimetype: String!
  encoding: String!
}

type Command {
  command: Int!
  status: String
}

type Download {
  step: Int!
  download: String!
}

type Cable {
  id: ID
  name: String
  lifespan: Int
  diameter: Int
  size: Int
  general_state: String
  created_at: DateTime
  updated_at: DateTime
}

type Report {
  id: ID
  start: DateTime
  end: DateTime
  alert_level: String
  created_at: DateTime
  updated_at: DateTime
  cable_id: ID
  analysis: [Analysis]
}

type Analysis {
  id: ID
  position_start: ID
  position_end: String
  image_path: String
  state: String
  manual_state: String
  neural_net_state: String
  report_id: ID
  cable_id: ID
  created_at: DateTime
  updated_at: DateTime
  cable: Cable
}

type ReportStates {
  normal: Int
  danificado: Int
  muitoDanificado: Int
}

scalar Upload

# Queries
type Query {
  analysis (id: ID!): Analysis
  cable (id: ID!): Cable
  cables: [Cable]
  report (id: ID!): Report
  reports (cableId: ID!): [Report]
  reportAnalysis(reportId: ID!): [Analysis]
  reportComplete (id: ID!): Report
  reportErrors (id: ID!): ReportStates
  command (command: Int!): Command
  downloadFolder (step: Int!): Download
}

# Mutations
type Mutation {
  createCable (name: String, size: Int!, diameter: Int!, lifespan: Int!): ID
  updateCable (id: ID!, lifespan: Int, generalState: String): Cable
  deleteCable (id: ID!): Boolean
  createReport (cableId: ID!): ID
  updateReport (id: ID!, alertLevel: String): Report
  deleteReport (id: ID!): Boolean
  createAnalysis (positionStart: Int, positionEnd: Int, reportId: ID, cableId: ID, imagePath: String): ID
  updateAnalysis (id: ID!, imagePath: String, state: String): Analysis
  setAnalysisManualState (id: ID!, state: String): Analysis
  deleteAnalysis (id: ID!): Boolean
}

# Subscriptions
type Subscription {
  analysisWasCreated: Analysis!
  endCable: Boolean!
}
`
