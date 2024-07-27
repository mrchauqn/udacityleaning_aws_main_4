import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  console.log('Processing create event: ', event)

  const userId = getUserId(event)
  const newTodo = JSON.parse(event.body)

  const newItem = await createTodo(newTodo, userId)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
