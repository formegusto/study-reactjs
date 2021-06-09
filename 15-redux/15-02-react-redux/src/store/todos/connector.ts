import { connect } from 'react-redux';
import { RootStore } from '../';
import { todosActionCreator } from './actions';
import { TodosStore } from '.';

const mapState = ({ todos }: RootStore): TodosStore => ({
  ...todos,
});

/*
const mapDispatch = (dispatch: Dispatch<TodosAction>) =>
  bindActionCreators<TodosAction, typeof todosActionCreator>(
    todosActionCreator,
    dispatch,
  );
*/

const TodosConnector = connect(mapState, todosActionCreator);

export default TodosConnector;
