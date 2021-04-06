import { withRouter } from 'next/router';
import BlockUI from 'react-block-ui';
import GoogleLoader from '../modules/shared/GoogleLoader';
import { getFilecoinInstance } from '../../config/contractinstance';
import web3 from '../../config/web3';
import { _setToken, _handleCreateToken } from '../modules/utils';
import NetworkTypeDialogContainer from '../modules/shared/main-template/NetworkTypeDialog/NetworkTypeDialogContainer';

export default (ComposedComponent) => {
  class Auth extends React.Component {
    state={
      pageAccessible: false,
      metamaskLoginMessage: '',
    }

    async componentDidMount() {
      let networkType;
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        this.setState({
          metamaskLoginMessage: 'Connect your metamask account (& reload)',
        });
        await window.ethereum.enable();
      } else {
        await web3.eth.net.getNetworkType()
          .then((type) => {
            networkType = type;
          });

        if (networkType !== 'kovan') {
          this.setState({
            displayMessage: `Network Error: Change network ${networkType} to kovan`,
          });
        } else {
          const isRegisterUser = await getFilecoinInstance().methods.isRegisterUser(accounts[0]).call();
          if (!isRegisterUser) {
            this.props.router.push('/');
            this.setState({
              pageAccessible: true
            });
          } else {
            const filecoinToken = await getFilecoinInstance().methods.getFilecoinToken(accounts[0]).call();
            _setToken(filecoinToken);
            this.props.router.push('/dashboard');
            setTimeout(() => {
              this.setState({
                pageAccessible: true,
              });
            }, 1000);
          }
          this.setState({ metamaskAddress: accounts[0] });
        }
      }
    }

    render() {
      const { metamaskLoginMessage, displayMessage } = this.state;
      return (
        <>
          <BlockUI
            tag="div"
            blocking={!this.state.pageAccessible}
            loader={<GoogleLoader height={50} width={50} />}
            renderChildren={false}
            className="full-screen"
          >
            <ComposedComponent {...this.props} />
          </BlockUI>
          <NetworkTypeDialogContainer
            displayMessage={metamaskLoginMessage || displayMessage}
            openDialog={metamaskLoginMessage || displayMessage}
          />
        </>
      )
    }
  }

  return withRouter(Auth);
}