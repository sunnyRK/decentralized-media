import Info from './Info';
import { _uploadToFilecoin, _handleInfo, _handleCreateToken, _setToken } from '../../utils';
import web3 from '../../../../config/web3';
import { getFilecoinInstance } from '../../../../config/contractinstance';

class InfoContainer extends React.Component {
  state = {
    addrsList: [],
    value: '',
    info: {},
    infoLoading: false,
  };

  async componentDidMount() {
    this.setState({ infoLoading: true });
    const accounts = await web3.eth.getAccounts();
    const filecoinToken = await getFilecoinInstance().methods.getFilecoinToken(accounts[0]).call();
    _setToken(filecoinToken);
    const { addrsList, info } = await _handleInfo();
    this.setState({ addrsList, info, infoLoading: false });
  }

  render() {
    const { handleState } = this.props;
    const { addrsList, info, infoLoading } = this.state;
    return (
      <Info
        addrsList={addrsList}
        handleState={handleState}
        info={info}
        infoLoading={infoLoading}
      />
    )
  }
}

export default InfoContainer;
