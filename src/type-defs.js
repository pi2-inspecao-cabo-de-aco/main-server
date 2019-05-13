export default `
type File {
  filename: String!
  mimetype: String!
  encoding: String!
}

type Cable {
  id: ID
  lifespan: Int
  diameter: Int
  size: Int
  general_state: String
}

type Report {
  id: ID
  start: String
  end: String
  alert_level: String
}

scalar Upload

# Queries
type Query {
  fileUpload (filename: String!): String!
  cable (id: ID!): Cable
}

# Mutations
type Mutation {
  createCable (size: Int!, diameter: Int!, lifespan: Int!): ID
  updateCable (id: ID!, lifespan: Int, generalState: String): Cable
  deleteCable (id: ID!): Boolean
  createReport: ID
  updateReport (id: ID!, alertLevel: String): Report
  deleteReport (id: ID!): Boolean
}
`
