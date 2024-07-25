import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
import {} from '@aws-sdk/s3-request-presigner'

export function handler(event) {
  console.log('Processing upload url event: ', event)
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return undefined
}

