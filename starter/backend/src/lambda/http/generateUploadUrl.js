import { getUserId } from '../utils.mjs'
import { createLogger } from '../utils/logger.mjs'
import { getUploadUrl } from '../../businessLogic/todos.mjs'

const logger = createLogger('upload')

export async function handler(event) {
  console.log('Processing upload url event: ', event)

  const todoId = event.pathParameters.todoId
  const userId = getUserId()

  const responseUrl = await getUploadUrl(todoId, userId)

  logger.info('pre-signed upload url result', {
    value: responseUrl
  })

  // Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      responseUrl
    })
  }
}
