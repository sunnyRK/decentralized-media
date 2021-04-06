import { Component } from 'react';
import { withRouter } from 'next/router';
import { toast } from 'react-toastify';

import Landing from './Landing';
import { getFilecoinInstance } from '../../../../config/contractinstance';
import { _handleCreateToken, _setToken, _handleInfo } from '../../utils';

import web3 from "../../../../config/web3";

class LandingContainer extends Component {
  state = {
    landingLoading: false,
  }

  onRegisterClick = async () => {
    try {
      this.setState({ landingLoading: true });
      const accounts = await web3.eth.getAccounts();
      const filecoinToken = await _handleCreateToken();
      _setToken(filecoinToken);
      const { addrsList, info } = await _handleInfo();
      await getFilecoinInstance().methods
        .registerUser(filecoinToken, addrsList[0].addr)
        .send({ from: accounts[0] });
      this.props.router.push('/dashboard');
      toast.success('Successfully registered', {
        position: toast.POSITION.TOP_RIGHT,
      });
      this.setState({ landingLoading: false });
    } catch (error) {
      this.setState({ landingLoading: false });
      toast.error('Something went wrong! Please try again later.' ,{
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  render() {
    const { landingLoading } = this.state;
    return (
      <Landing
        onRegisterClick={this.onRegisterClick}
        landingLoading={landingLoading}
      />
    )
  }
}

export default withRouter(LandingContainer);
