import { useEffect } from 'react';
import { Outlet, useNavigate, useMatch } from 'react-router-dom';
import style from './layout-todo.module.css'

export const LayoutTodo = () => {
	const navigate = useNavigate();
	const isTodoUrl = useMatch('/todo');

	useEffect(() => {
		if (!isTodoUrl) {
			return
		} else {
			navigate('/not-found');
		}
	}, [isTodoUrl, navigate]);

	return (
		<div className={style.wrapper}>
			<button className={style.btn} onClick={() => navigate(-1)}>⇐</button>
			<span className={style.span}>Страница редактирования задачи</span>
			<Outlet />
		</div>
	);
};
