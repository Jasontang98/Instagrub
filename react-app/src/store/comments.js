export const GET_COMMENTS = 'comments/getComments';
export const ADD_COMMENT = 'comments/addComment';
export const DELETE_COMMENT = 'comments/deleteComment';
export const EDIT_COMMENT = 'comments/editComment';
export const CLEAN_STATE = 'comments/cleanState';

const getComments = (comments) => ({
	type: GET_COMMENTS,
	comments,
});

const addComment = (comment) => ({
	type: ADD_COMMENT,
	comment,
});

const deleteComment = (id) => ({
	type: DELETE_COMMENT,
	id,
});

const editComment = (comment) => ({
	type: EDIT_COMMENT,
	comment,
});

export const cleanComments = () => {
	return {
		type: CLEAN_STATE,
	};
};

export const getCommentsByImage = (image_id) => async (dispatch) => {
	const response = await fetch(`/api/images/${image_id}/comments`);

	if (response.ok) {
		const data = await response.json();
		dispatch(getComments(data));
		return data;
	}
};

export const addAComment = (data) => async (dispatch) => {
	const { user_id, image_id, comment } = data;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('image_id', image_id);
    form.append('comment', comment);

	const response = await fetch(`/api/images/${image_id}`, {
		method: 'POST',
		body: form

	});
	if (response.ok) {
		const data = await response.json();
		dispatch(addComment(data));
		return data;
	}
};

export const deleteAComment = (image_id, id) => async (dispatch) => {
	const response = await fetch(`/api/images/${image_id}/comments/${id}`, {
		method: 'DELETE',
	});
	if (response.ok) {
		dispatch(deleteComment(id));
	}
};

export const editAComment = (data, id) => async (dispatch) => {
	const { user_id, image_id, comment } = data;
	const response = await fetch(`/api/images/${image_id}/comments/${id}`, {
		method: 'PUT',
		body: JSON.stringify({
			user_id,
			image_id,
			comment,
		}),
	});
	if (response.ok) {
		const data = await response.json();
		dispatch(editComment(comment));
		return data;
	}
};

const initialState = {};

const commentsReducer = (state = initialState, action) => {
    let newState;
	switch (action.type) {
		case GET_COMMENTS:
			newState = { ...state };
			action.comments.comments.forEach((comment) => {
				newState[comment.id] = comment;
			});
			return newState;
		case CLEAN_STATE:
			const clearState = {};
			return clearState;
		case ADD_COMMENT:
			return { ...state, [action.comment.id]: action.comment };
		case EDIT_COMMENT:
			return {
				...state,
				comments: state.comments.map((comment) => {
					if (comment.id === action.comment.id) {
						return action.comment;
					}
					return comment;
				}),
			};
		case DELETE_COMMENT:
			return delete { ...state, [action.id]: action.id };
		default:
			return state;
	}
};

export default commentsReducer;
