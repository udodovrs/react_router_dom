import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Todo } from './components/todo/todo';
import { TodoList } from './components/todo_list/todo-list';
import { LayoutTodo } from './components/layout_todo/layout-todo';
import { NotFound } from './components/not_found/not-found'
import { TodoNotFound } from './components/todo_not_found/todo-not-found'

export const App = () => {
	const [isUpdateListTodo, setIsUpdateListTodo] = useState(false);
	const updateTodoList = () => setIsUpdateListTodo(!isUpdateListTodo);

	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						<TodoList
							isUpdateListTodo={isUpdateListTodo}
							updateTodoList={updateTodoList}
						/>
					}
				/>
				<Route path="/todo" element={<LayoutTodo />}>
					<Route
						path=":id"
						element={<Todo updateTodoList={updateTodoList} />}
					/>
				</Route>
				<Route path="/todo-not-found" element={<TodoNotFound />}></Route>
				<Route path="/not-found" element={<NotFound />}></Route>
				<Route path="*" element={<NotFound />}></Route>
			</Routes>
		</>
	);
};
