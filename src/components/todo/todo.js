import { useState, useEffect, useRef, useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import style from './todo.module.css';

export const Todo = ({ updateTodoList }) => {
	const { id } = useParams();
	const [todo, setTodo] = useState(null);
	const [update, setUpdate] = useState(false);
	const [isInputForEdit, setIsInputForEdit] = useState(false);
	const navigate = useNavigate();
	const valueInputForEdit = useRef('');

	const updateInputForEdit = (value) => (valueInputForEdit.current = value);


	const handleUpdatetodo = useCallback(()=>setUpdate(!update),[update])

	useEffect(() => {
		fetch(`http://localhost:3005/todos/${id}`)
			.then((res) => res.json())
			.then((res) => {
				res.id ? setTodo(res) : navigate('/todo-not-found');
			})
			.catch((error) => console.log(error));
	}, [id, navigate, handleUpdatetodo]);

	const handleCheckBox = (id, handleUpdatetodo, todo) => {
		let isCompleted = null;
		if (todo.completed) {
			isCompleted = false;
		} else {
			isCompleted = true;
		}

		fetch(`http://localhost:3005/todos/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json;charset=utf-8' },
			body: JSON.stringify({
				completed: isCompleted,
			}),
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				handleUpdatetodo();
				console.log('PATCH:', response);
			});
	};

	const handleDelete = (id, handleUpdatetodo, updateTodoList) => {
		navigate(-1);
		fetch(`http://localhost:3005/todos/${id}`, {
			method: 'DELETE',
		})
			.then((rawResponse) => rawResponse.json())
			.then((response) => {
				handleUpdatetodo();
				updateTodoList();
				console.log('DELETE:', response);
			});
	};

	const InputForEdit = ({todo, updateInputForEdit }) => {
		const [valueEdit, setValueEdit] = useState(todo.title);

		return (
			<input
			    className={style.input}
				  value={valueEdit}
				  onChange={({ target }) => {
					updateInputForEdit(target.value);
					setValueEdit(target.value);
				}}
			/>
		);
	};

	const handleEdit = () => {
		setIsInputForEdit(!isInputForEdit);
		if (
			todo.title !== valueInputForEdit.current &&
			valueInputForEdit.current !== '' &&
			isInputForEdit
		) {
			fetch(`http://localhost:3005/todos/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json;charset=utf-8' },
				body: JSON.stringify({
					title: valueInputForEdit.current,
				}),
			})
				.then((rawResponse) => rawResponse.json())
				.then((response) => {
					handleUpdatetodo();
					updateTodoList();
					console.log('PATCH:', response);
				});
		}
	};

	return (
		<div className={style.wrapper}>
			{todo ? (
				<div className={style.todo}>
					{isInputForEdit ? (
						<InputForEdit
							todo={todo}
							updateInputForEdit={updateInputForEdit}
						/>
					) : (
						<span className={style.span}>{todo.title}</span>
					)}
					<button className={style.btn} onClick={handleEdit}>
						{isInputForEdit ? '✔' : '✎'}
					</button>
					<button
						className={style.btn}
						onClick={() => handleDelete(id, handleUpdatetodo, updateTodoList)}
					>
						🗑️
					</button>
					<input
					  className={style.checkbox}
						type="checkbox"
						checked={todo.completed}
						onChange={() => handleCheckBox(id, handleUpdatetodo, todo)}
					/>
				</div>
			) : (
				'Loading...'
			)}
		</div>
	);
};
