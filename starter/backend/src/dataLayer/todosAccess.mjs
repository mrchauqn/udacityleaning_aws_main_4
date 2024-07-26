import AWSXRay from 'aws-xray-sdk-core'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todoTable = process.env.TODO_TABLE,
    s3Client = new S3Client()
  ) {
    this.dynamoDbClient = DynamoDBDocument.from(documentClient)
    this.todoTable = todoTable
    this.s3Client = s3Client
  }

  async updateDataUrl(attachmentUrl, todoId, userId) {
    await this.dynamoDbClient.update({
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'set attachmentUrl=:attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'UPDATED_NEW'
    })

    return
  }
}
