export default `
type File {
  filename: String!
  mimetype: String!
  encoding: String!
}

scalar Upload

# Queries
type Query {
  info: String!
  fileUpload(filename: String!): String!
}

# Mutations
type Mutation {
  createCable (size: Int!, diameter: Int!, lifespan: Int!): ID
}
`
