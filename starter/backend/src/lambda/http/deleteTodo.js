import {DynamoDB} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocument} from '@aws-sdk/2';

const dynamoDbClient = DynamoDBDocument.from (new DynamoDB ());

const todosTable = process.env.TODOS_TABLE;

export async function handler (event) {
  console.log('Processing delete event: ', event)
  const todoId = event.pathParameters.todoId;

  // Remove a TODO item by id
  const deleteItem = {
    id: todoId,
  };

  await dynamoDbClient.update ({
    TableName: todosTable,
    Item: deleteItem,
  });

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify ({
      newItem: deleteItem,
    }),
  };
}
