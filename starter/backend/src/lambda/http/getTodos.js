import {DynamoDB} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocument} from '@aws-sdk/lib-dynamodb';
import { getUserId } from '../utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing event get todos by user: ', event)

  const userId = getUserId(event)

  const result = await dynamoDbClient.query({
    TableName: todosTable,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  })
  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}
