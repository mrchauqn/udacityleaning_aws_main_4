import { v4 as uuidv4 } from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todoAccess = new TodosAccess()

export async function createTodo(newTodo, userId) {
  const todoId = uuidv4()
  const { name, dueDate } = newTodo

  const newItem = {
    todoId,
    userId: userId,
    attachmentUrl: '',
    dueDate,
    createdAt: new Date().toISOString(),
    name,
    done: false
  }

  return await todoAccess.createTodo(newItem)
}

export async function updateTodo(updateTodo, todoId, userId) {
  return await todoAccess.updateTodo(userId, todoId, updateTodo)
}

export async function getTodos(userId) {
  return await todoAccess.getTodos(userId)
}

export async function deleteTodo(todoId, userId) {
  Promise.all([
    todoAccess.deleteTodo(todoId, userId),
    todoAccess.deleteTodoAttachment(todoId)
  ])
}

export async function getUploadUrl(todoId, userId) {
  return await todoAccess.getUploadUrl(todoId, userId)
}
