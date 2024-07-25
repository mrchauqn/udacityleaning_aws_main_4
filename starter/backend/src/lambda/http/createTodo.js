import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'
import { getUserId } from '../utils.mjs'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing create event: ', event)

  const todoId = uuidv4()
  const userId = getUserId()

  const { name, dueDate } = JSON.parse(event.body)

  const newItem = {
    todoId,
    userId: userId,
    attachmentUrl: '',
    dueDate,
    createdAt: new Date().toISOString(),
    name,
    done: false
  }

  await dynamoDbClient.put({
    TableName: todosTable,
    Item: newItem
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
