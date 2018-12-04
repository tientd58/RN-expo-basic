// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API'

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default () => next => async action => {

    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
      return next(action)
    }
    
    const { types, service, params, payload } = callAPI;

    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.');
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.');
    }

    function actionWith(data) {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[CALL_API];
        return finalAction;
    }

    const [ requestType, successType, failureType ] = types;
    next(actionWith({ type: requestType }));

    try {
        const response = await service(params);
        return next(actionWith({
            payload: { ...response, ...payload },
            type: successType
        }));
    } catch (error) {
        return next(actionWith({
            type: failureType,
            error: error || 'Something bad happened'
        }));
    }
};