import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  console.log('Processing update event', event)

  const todoPayload = JSON.parse(event.body)
  const todoId = event.pathParameters.todoId
  const userId = getUserId(event)

  const updateResponse = await updateTodo(todoPayload, todoId, userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      responseUpdate: updateResponse
    })
  }
}
