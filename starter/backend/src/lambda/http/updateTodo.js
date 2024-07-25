import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/2'

const dynamoDbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE

export async function handler(event) {
  console.log('Processing update event: ', event)
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)
  
  // Update a TODO item with the provided id using values in the "updatedTodo" object

  const updateItem = {
    id: todoId,
    ...updatedTodo
  }

  await dynamoDbClient.update({
    TableName: todosTable,
    Item: updateItem
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem: updateItem
    })
  }
}
