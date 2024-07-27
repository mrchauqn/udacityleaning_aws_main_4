import AWSXRay from 'aws-xray-sdk-core'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    // eslint-disable-next-line no-undef
    todoTable = process.env.TODOS_TABLE,
    s3Client = new S3Client()
  ) {
    this.dynamoDbClient = DynamoDBDocument.from(documentClient)
    this.todoTable = todoTable
    this.s3Client = s3Client
  }

  async createTodo(todo) {
    await this.dynamoDbClient.put({
      TableName: this.todoTable,
      Item: todo
    })

    return todo
  }

  async updateTodo(userId, todoId, updatePayload) {
    console.log(`Update todo ${todoId} for user ${userId}`)

    const updatedTodo = await this.dynamoDbClient.update({
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'set #name = :name, dueDate=:dueDate, done=:done',
      ExpressionAttributeValues: {
        ':name': updatePayload.name,
        ':dueDate': updatePayload.dueDate,
        ':done': updatePayload.done
      },
      ExpressionAttributeNames: { '#name': 'name' },
      ReturnValues: 'UPDATED_NEW'
    })

    return updatedTodo
  }

  async getTodos(userId) {
    console.log(`Get all todos of user ${userId}`)

    const todos = await this.dynamoDbClient.query({
      TableName: this.todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })

    console.log('todos', todos)
    return todos.Items
  }

  async deleteTodoAttachment(todoId) {
    console.log(`Delete attachment for todo id ${todoId}`)

    await this.s3Client.deleteObject({
      // eslint-disable-next-line no-undef
      Bucket: process.env.TODO_S3_BUCKET,
      Key: todoId
    })
  }

  async deleteTodo(todoId, userId) {
    console.log(`Delete todo id ${todoId}`)

    const deletedTodo = await this.dynamoDbClient.delete({
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      },
      ReturnValues: 'ALL_OLD'
    })

    return deletedTodo
  }

  async getUploadUrl(todoId, userId) {
    console.log(`Get signed url for ${todoId}`)

    // === Get signed url ===
    const command = new PutObjectCommand({
      // eslint-disable-next-line no-undef
      Bucket: process.env.TODO_S3_BUCKET,
      Key: todoId
    })

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      // eslint-disable-next-line no-undef
      expiresIn: parseInt(process.env.SIGNED_URL_EXPIRATION)
    })

    // === Update DB data ===
    await this.dynamoDbClient.update({
      TableName: this.todoTable,
      Key: {
        todoId,
        userId
      },
      UpdateExpression: 'set attachmentUrl=:attachmentUrl',
      ExpressionAttributeValues: {
        // eslint-disable-next-line no-undef
        ':attachmentUrl': `https://${process.env.TODO_S3_BUCKET}.s3.amazonaws.com/${todoId}`
      },
      ReturnValues: 'UPDATED_NEW'
    })

    return uploadUrl
  }
}
