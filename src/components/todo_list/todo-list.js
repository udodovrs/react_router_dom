import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './todo-list.module.css';

export const TodoList = ({ isUpdateListTodo, updateTodoList }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [todos, setTodos] = useState([]);
	const [valueForSearh, setValueForSearh] = useState('');
	const [isAlphabet, setIsAlphabet] = useState(false);
	const [isInputForSetNewTodo, setIsInputForSetNewTodo] = useState(false);
	const [valueForNewTodo, setValueForNewTodo] = useState('');

	useEffect(() => {
		setIsLoaded(true);
		fetch(`http://localhost:3005/todos`)
			.then((res) => res.json())
			.then((todos) => setTodos(todos))
			.catch((error) => console.error(error))
			.finally(() => setIsLoaded(false));
	}, [isUpdateListTodo]);

	const handleSetNewTodo = (value) => {
		setIsInputForSetNewTodo(!isInputForSetNewTodo);
		if (isInputForSetNewTodo && value) {
			fetch(`http://localhost:3005/todos`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json;charset=utf-8' },
				body: JSON.stringify({
					title: value,
					completed: false,
				}),
			})
				.then((rawResponse) => rawResponse.json())
				.then((response) => {
					console.log('POST:', response);
					updateTodoList();
					setValueForNewTodo('');
				});
		}
	};

	let filteredTodos = null;

	if (isAlphabet) {
		filteredTodos = [...todos]
			.sort((a, b) => {
				const titleA = a.title.toLowerCase();
				const titleB = b.title.toLowerCase();
				if (titleA < titleB) return -1;
				if (titleA > titleB) return 1;
				return 0;
			})
			.filter(({ title }) => {
				return title.toLowerCase().includes(valueForSearh.toLowerCase());
			});
	} else {
		filteredTodos = todos.filter(({ title }) => {
			return title.toLowerCase().includes(valueForSearh.toLowerCase());
		});
	}

	return (
		<div className={style.wrapper}>
			<div className={style.searchAndSort}>
				<input
					className={style.input}
					type="text"
					name="search"
					value={valueForSearh}
					placeholder="поиск"
					onChange={({ target }) => setValueForSearh(target.value)}
				/>
				<button onClick={() => setIsAlphabet(!isAlphabet)}>
					{isAlphabet ? '▲' : '▼'}
				</button>
			</div>
			<div>
				<div className={style.todoList}>
					{isLoaded
						? 'Loading...'
						: filteredTodos.map(({ id, title, completed }) => (
								<div key={id} className={style.todo}>
									<span
										className={
											completed
												? style.greenCircule
												: style.grayCircule
										}
									></span>
									<Link to={`/todo/${id}`} className={style.link}>
										{title}
									</Link>
								</div>
						  ))}
				</div>
				<div className={style.newTodo}>
					{isInputForSetNewTodo && (
						<input
							type="text"
							value={valueForNewTodo}
							className={style.input}
							onChange={({ target }) => setValueForNewTodo(target.value)}
							placeholder="новая задача..."
						/>
					)}
					<button onClick={() => handleSetNewTodo(valueForNewTodo)}>
						{isInputForSetNewTodo ? '✔' : '╋'}
					</button>
				</div>
			</div>
		</div>
	);
};
