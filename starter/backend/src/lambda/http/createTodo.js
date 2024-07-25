import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing create event: ', event)
  // Implement creating a new TODO item
  const itemId = uuidv4()

  const parsedBody = JSON.parse(event.body)

  const newItem = {
    id: itemId,
    ...parsedBody
  }

  await dynamoDbClient.put({
    TableName: todosTable,
    Item: newItem
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }
}

