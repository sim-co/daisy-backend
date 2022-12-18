import app from "./app.js"
import awsServerlessExpress from "aws-serverless-express"

const server = awsServerlessExpress.createServer(app)

export const handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context)