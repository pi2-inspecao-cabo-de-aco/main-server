export default `
type File {
  filename: String!
  mimetype: String!
  encoding: String!
}

type Cable {
  id: ID
  name: String
  lifespan: Int
  diameter: Int
  size: Int
  general_state: String
  created_at: String
  updated_at: String
}

type Report {
  id: ID
  start: String
  end: String
  alert_level: String
  created_at: String
  updated_at: String
  cable_id: ID
}

type Analysis {
  id: ID
  position_start: ID
  position_end: String
  image_path: String
  state: String
  report_id: ID
  cable_id: ID
  created_at: String
  updated_at: String
}

scalar Upload

# Queries
type Query {
  fileUpload (filename: String!): String!
  cable (id: ID!): Cable
  cables: [Cable]
  report (id: ID!): Report
  reports (cableId: ID!): [Report]
  reportAnalysis(reportId: ID!): [Analysis]
}

# Mutations
type Mutation {
  createCable (name: String, size: Int!, diameter: Int!, lifespan: Int!): ID
  updateCable (id: ID!, lifespan: Int, generalState: String): Cable
  deleteCable (id: ID!): Boolean
  createReport (cableId: ID!): ID
  updateReport (id: ID!, alertLevel: String): Report
  deleteReport (id: ID!): Boolean
  createAnalysis (positionStart: Int, positionEnd: Int, reportId: ID, cableId: ID, image_path: String): ID
  updateAnalysis (id: ID!, imagePath: String, state: String): Analysis
  deleteAnalysis (id: ID!): Boolean
}

# Subscriptions
type Subscription {
  analysisWasCreated: Analysis!
}
`
