// Получение элементов страницы
const $form = document.querySelector('#taskForm')
const $input = document.querySelector('#taskInput')
const $list = document.querySelector('#taskList')
const $listZero = document.querySelector('#listZero')
const $tasks = document.querySelector('#tasks')

let tasks = []

// Функция создания задачи
const renderTask = task => {
	const cssClass = task.done
		? 'main__list-item-text task-close'
		: 'main__list-item-text'

	// Создаём HTML разметку задачи
	const taskHTML = `
<li id='${task.id}' class="main__list-item">
<span class="${cssClass}">${task.text}</span>
<div class="main__list-item-buttons">
<button type='button' data-action='done' class="main__list-item-btn main__list-item-btn-done">
	<img src="img/tick.svg" alt="done" />
</button>
<button type='button' data-action='delete' class="main__list-item-btn main__list-item-btn-delete">
	<img src="img/cross.svg" alt="delete" />
</button>
</div>
</li>
`

	$list.insertAdjacentHTML('beforeend', taskHTML)
}

// Если в LS есть данные, то отобразить их на странице (добавить в массив)
if (localStorage.getItem('tasks')) {
	// Превращаем строку в массив и перезаписываем данные в массив
	tasks = JSON.parse(localStorage.getItem('tasks'))
	// Отображаем элементы на странице
	tasks.forEach(task => renderTask(task))
}

// Сохраняем данные массива в LS
const saveToLS = () => {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

// Функция добавления "Список задач пуст"
const checkEmptyList = () => {
	// Если массив пустой, отображать элемент "список задач пуст"
	if (tasks.length === 0) {
		const emptyHTML = `
		<li id="listZero" class="main__list-item-zero">
		<img src="img/leaf.svg" alt="todo list" />
		<p class="main__list-item-text">Список задач пуст.</p>
	</li>
		`

		$list.insertAdjacentHTML('afterbegin', emptyHTML)
	}
	// Если массив Не пустой, убирать элемент "список задач пуст"
	if (tasks.length > 0) {
		const emptyEl = document.querySelector('#listZero')

		emptyEl ? emptyEl.remove() : null
	}
}

checkEmptyList()

// Функция добавления задачи
const addTask = e => {
	e.preventDefault()

	// Достаём текст с input
	const inputText = $input.value
	// Работа с LocalStorage
	// Описываем задачу в виде объекта
	const newTask = {
		id: Date.now(),
		text: inputText,
		done: false,
	}

	// Добавляем задачу в массив
	tasks.push(newTask)

	saveToLS()
	renderTask(newTask)

	$input.value = ''
	$input.focus()

	checkEmptyList()
}

// Функция удаления задачи
const deleteTask = e => {
	// Проверяем, если кнопка удаления НЕ нажата, то выходим из функции
	if (e.target.dataset.action !== 'delete') return

	// Проверяем, что нажата кнопка удаления задачи
	const perentEl = e.target.closest('.main__list-item')

	// Получаем id элемента li
	const taskId = Number(perentEl.id)

	// Находим индекс нужного элемента в массиве
	// const index = tasks.findIndex(task => task.id === taskId)

	// Удаляем эту задачу из массива
	// tasks.splice(index, 1)

	// Удаляем задачу с массива при помощи filter
	tasks = tasks.filter(task => task.id !== taskId)

	saveToLS()

	// Удаляем задачу из разметки
	perentEl.remove()

	checkEmptyList()
}

// Функция "задача завершена"
const doneTask = e => {
	if (e.target.dataset.action !== 'done') return

	const perentEl = e.target.closest('.main__list-item')
	const taskId = Number(perentEl.id)
	const task = tasks.find(task => task.id === taskId)

	// Изменяем значение свойства "done" в объекте task
	task.done = !task.done

	saveToLS()

	perentEl.classList.toggle('task-close')
}

// Добавляем функции
$form.addEventListener('submit', addTask)
$list.addEventListener('click', deleteTask)
$list.addEventListener('click', doneTask)
