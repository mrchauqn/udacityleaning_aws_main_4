import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing update event', event)

  const todoPayload = JSON.parse(event.body)
  const todoId = event.pathParameters.groupId
  const userId = getUserId(event)

  const responseUpdate = await dynamoDbClient.update({
    TableName: todosTable,
    Key: {
      todoId,
      userId
    },
    UpdateExpression: 'set #name = :name, dueDate=:dueDate, done=:done',
    ExpressionAttributeValues: {
      ':name': todoPayload.name,
      ':dueDate': todoPayload.dueDate,
      ':done': todoPayload.done
    },
    ExpressionAttributeNames: { '#name': 'name' },
    ReturnValues: 'UPDATED_NEW'
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      responseUpdate
    })
  }
}
