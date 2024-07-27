import { getUserId } from '../utils.mjs'
import { getTodos } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  console.log('Processing event get todos by user: ', event)

  const userId = getUserId(event)

  const items = await getTodos(userId)

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
