import Dashboard from './Dashboard';
import AddFileContainer from './AddFile/AddFileContainer';

class DashboardContainer extends React.Component {
  state = {
    isAddFileOpen: false,
  }

  handleState = (state) => {
    this.setState(state);
  }

  render() {
    return (
      <>
        <Dashboard
          handleState={this.handleState}
          />
        <AddFileContainer
          openDialog={this.state.isAddFileOpen}
          handleState={this.handleState}
        />
      </>
    )
  }
}

export default DashboardContainer;
