import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  console.log('Processing update event', event)

  const todoPayload = JSON.parse(event.body)
  const userId = getUserId(event)

  const updateResponse = await updateTodo(todoPayload, userId)

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
