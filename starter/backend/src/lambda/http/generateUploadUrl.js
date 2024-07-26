import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { updateDataUrl } from '../../dataLayer/todosAccess.mjs'
import { getUserId } from '../utils.mjs'
import { createLogger } from '../utils/logger.mjs'

const s3Client = new S3Client()
const logger = createLogger('auth')

export async function handler(event) {
  console.log('Processing upload url event: ', event)
  const todoId = event.pathParameters.todoId
  const userId = getUserId()

  const uploadUrl = await getPreSignedUrl(todoId)

  logger.info('pre-signed before update database', {
    value: uploadUrl
  })

  await updateDataUrl(
    `https://${process.env.TODO_S3_BUCKET}.s3.amazonaws.com/${todoId}`,
    todoId,
    us
  )

  // Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl
    })
  }
}

async function getPreSignedUrl(todoId) {
  console.log(`Get pre-signed url for ${todoId}`)
  const command = new PutObjectCommand({
    Bucket: process.env.TODO_S3_BUCKET,
    Key: todoId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: parseInt(process.env.SIGNED_URL_EXPIRATION)
  })
  return url
}
