import { getUserId } from '../utils.mjs'
import { deleteTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  console.log('Processing delete event', event)

  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const responseDelete = await deleteTodo(todoId, userId)

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
