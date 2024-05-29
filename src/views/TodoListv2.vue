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
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { ref, computed, watch } from 'vue'

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

const isOpen = ref(false)
const noCompletedTasksDialogOpen = ref(false)

function addTodo() {
  addDoc(collection(db, 'todos'), { text: newTodo.value, done: false })
    .then((docRef) => {
      newTodo.value = ''
      console.log('Todo successfully added')
      console.log('Document ID:', docRef.id)
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

function closeModal() {
  isOpen.value = false
}
function openModal() {
  if (completedTodos.value.length > 0) {
    isOpen.value = true
  } else {
    noCompletedTasksDialogOpen.value = true
  }
}

onSnapshot(collection(db, 'todos'), (snapshot) => {
  todos.value = []
  snapshot.forEach((doc) => {
    todos.value.push({ id: doc.id, ...doc.data() })
  })
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
      <div class="todo-list">
        <ul>
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
        </ul>
      </div>

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

      <!-- Dialog for confirmation -->
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25"></div>
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    確認
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">全ての完了タスクを削除しますか？</p>
                  </div>

                  <div class="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      @click="closeModal"
                    >
                      いいえ
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      @click="deleteCompleted"
                    >
                      はい
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>

      <!-- Alert when there is no done task checked -->
      <TransitionRoot appear :show="noCompletedTasksDialogOpen" as="template">
        <Dialog
          as="div"
          @close="noCompletedTasksDialogOpen = false"
          class="fixed inset-0 flex items-center justify-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25"></div>
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    完了タスクがなし
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">削除する完了したタスクはありません。</p>
                    <p class="text-sm text-gray-500">
                      完了したいタスクのチェックボックスをクリックしてください。
                    </p>
                  </div>

                  <div class="mt-4">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click="noCompletedTasksDialogOpen = false"
                    >
                      OK
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
      <!-- end -->
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
