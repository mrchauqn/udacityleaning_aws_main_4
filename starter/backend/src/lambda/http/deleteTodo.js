import {DynamoDB} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { getUserId } from '../utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing delete event', event)

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const responseDelete = await dynamoDbClient.delete({
    TableName: todosTable,
    Key: {
      todoId,
      userId
    }
  })

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      responseUpdate: responseDelete
    })
  }
}
