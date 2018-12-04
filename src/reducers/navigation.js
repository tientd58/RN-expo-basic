import Navigator from '../navigator/index';

const initialState = Navigator.router.getStateForAction(
  Navigator.router.getActionForPathAndParams("AuthLoading")
);
const navigation = (state = initialState, action) => {
  const newState = Navigator.router.getStateForAction(action, state);
  return newState || state;
};

export default navigation;
