<script setup>
import LayoutView from '../layouts/LayoutView.vue'
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { ref, computed, watch } from 'vue'
import NoCompletedTasksDialog from '../components/NoCompletedTasksDialog.vue'
import ConfirmationDialog from '../components/ConfirmationDialog.vue'
import draggable from 'vuedraggable'

const db = getFirestore()
const newTodo = ref('')
const hideCompleted = ref(false)
const todos = ref([])

const filteredTodos = computed(() => {
  return hideCompleted.value ? todos.value.filter((t) => !t.done) : todos.value
})

const completedTodos = computed(() => {
  return todos.value.filter((t) => t.done)
})

function addTodo() {
  addDoc(collection(db, 'todos'), { text: newTodo.value, done: false })
    .then(() => {
      newTodo.value = ''
      console.log('Todo successfully added')
      // console.log('Document ID:', docRef.id)
    })
    .catch((error) => {
      console.error('Error adding todo: ', error)
    })
}

function removeTodo(todo) {
  deleteDoc(doc(db, 'todos', todo.id))
    .then(() => {
      console.log('Todo successfully deleted')
    })
    .catch((error) => {
      console.error('Error removing todo: ', error)
    })
}

function updateTodoStatus(todo) {
  const todoRef = doc(db, 'todos', todo.id)
  const updatedTodo = { ...todo, done: todo.done }
  updateDoc(todoRef, updatedTodo)
    .then(() => {
      console.log('Todo successfully updated')
    })
    .catch((error) => {
      console.error('Error updating todo: ', error)
    })
}

async function deleteCompleted() {
  const querySnapshot = await getDocs(query(collection(db, 'todos'), where('done', '==', true)))
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref)
      .then(() => {
        console.log('Completed todo successfully deleted')
      })
      .catch((error) => {
        console.error('Error deleting completed todo: ', error)
      })
  })
  closeModal()
}

const noCompletedTasksDialogOpen = ref(false)
const confirmationDialogOpen = ref(false)

function closeModal() {
  noCompletedTasksDialogOpen.value = false
  confirmationDialogOpen.value = false
}

function openModal() {
  if (completedTodos.value.length > 0) {
    confirmationDialogOpen.value = true
  } else {
    noCompletedTasksDialogOpen.value = true
  }
}

function onDragEnd(event) {
  // Reorder todos array after drag and drop
  todos.value.splice(event.newIndex, 0, todos.value.splice(event.oldIndex, 1)[0])
}

onSnapshot(collection(db, 'todos'), (snapshot) => {
  todos.value = []
  snapshot.forEach((doc) => {
    todos.value.push({ id: doc.id, ...doc.data() })
  })
  console.log('Fetched todos:', todos.value)
})

// Watch for changes to the todos array and update Firestore accordingly
watch(
  todos,
  (newTodos, oldTodos) => {
    newTodos.forEach((newTodo) => {
      const oldTodo = oldTodos.find((todo) => todo.id === newTodo.id)
      if (oldTodo && oldTodo.done !== newTodo.done) {
        updateTodoStatus(newTodo)
      }
    })
  },
  { deep: true }
)
</script>

<template>
  <LayoutView>
    <div class="max-w-md mx-auto mt-8">
      <!-- Form to add new todo -->
      <form @submit.prevent="addTodo" class="flex mb-4">
        <input
          v-model="newTodo"
          required
          placeholder="新しいToDo項目"
          class="flex-1 mr-2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
        <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Todo追加
        </button>
      </form>
      <!-- List of todos -->
      <draggable v-model="todos" class="todo-list" group="todos" @end="onDragEnd">
        <transition-group>
          <li
            v-for="todo in filteredTodos"
            :key="todo.id"
            class="flex items-center justify-between px-3 py-2 border-b"
          >
            <!-- Checkbox to mark todo as done -->
            <div class="flex items-center">
              <input
                type="checkbox"
                v-model="todo.done"
                @change="updateTodoStatus(todo)"
                class="mr-2 form-checkbox"
              />
              <span :class="{ 'line-through': todo.done, 'text-lg': true }">{{ todo.text }}</span>
            </div>

            <!-- delete todo -->
            <button
              @click="removeTodo(todo)"
              class="mt-4 px-4 py-2 text-red-700 hover:text-white bg-red-300 hover:bg-red-600 rounded-md"
            >
              X
            </button>
          </li>
        </transition-group>
      </draggable>
      <!-- toggle visibility of completed todos -->
      <button
        @click="hideCompleted = !hideCompleted"
        class="mt-4 mr-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
      >
        {{ hideCompleted ? 'すべて表示する' : '完了タスクを隠す' }}
      </button>

      <!-- delete all completed todos -->
      <button
        @click="openModal"
        class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        完了タスク削除
      </button>

      <NoCompletedTasksDialog :isOpen="noCompletedTasksDialogOpen" @close-no-task="closeModal" />

      <ConfirmationDialog
        :isOpen="confirmationDialogOpen"
        @close-modal="closeModal"
        @delete-completed="deleteCompleted"
      />
    </div>
  </LayoutView>
</template>

<style>
.todo-list {
  max-height: 36rem;
  overflow-y: auto;
}

.line-through {
  text-decoration: line-through;
}

.text-lg {
  font-size: 1.125rem;
}
</style>
