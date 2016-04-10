export const RESOLVE_PROMISE = 'smalldots/promise/RESOLVE_PROMISE'
export const REJECT_PROMISE = 'smalldots/promise/REJECT_PROMISE'

export function promiseReducer(state = {}, action) {
  if (action.type === RESOLVE_PROMISE) {
    return {
      ...state,
      [action.meta.id]: {
        data: action.payload
      }
    }
  }
  if (action.type === REJECT_PROMISE) {
    return {
      ...state,
      [action.meta.id]: {
        error: action.payload
      }
    }
  }
  return state
}

export function resolvePromise(id, data) {
  return {
    type: RESOLVE_PROMISE,
    payload: data,
    meta: { id }
  }
}

export function rejectPromise(id, error) {
  return {
    type: REJECT_PROMISE,
    payload: error,
    meta: { id }
  }
}

export function dispatchPromise(id, promise) {
  return dispatch => promise
    .then(data => dispatch(resolvePromise(id, data)))
    .catch(error => dispatch(rejectPromise(id, error)))
}
