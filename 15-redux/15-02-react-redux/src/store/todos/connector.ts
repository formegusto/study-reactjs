import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootStore } from '../';
import { TodosAction, todosActionCreator } from './actions';

const mapState = ({ todos }: RootStore) => ({
  todos: todos.todos,
  input: todos.input,
});

const mapDispatch = (dispatch: Dispatch<TodosAction>) =>
  bindActionCreators<TodosAction, typeof todosActionCreator>(
    todosActionCreator,
    dispatch,
  );

const TodosConnector = connect(mapState, mapDispatch);

export default TodosConnector;
