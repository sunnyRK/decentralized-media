import React, { Component } from 'react';

import Vidoes from './Videos';
import { getFilecoinInstance } from '../../../../config/contractinstance';
import web3 from '../../../../config/web3';
import { _uploadToFilecoin, getStorageConfig } from '../../utils';

class VidoesContainer extends Component {
  state = { 
    token: null, 
    info: null, 
    addrsList: [],
    selectedFile: null,
    account: '',
    ipfsHasharray: [],
    vidoesLoading: false,
  }

  componentDidMount = async () => {
    this.setState({ vidoesLoading: true });
    const ipfsHasharray = [];
    const accounts = await web3.eth.getAccounts();
    const hashLength = await getFilecoinInstance().methods.getIpfsHashLength(accounts[0]).call();
    console.log(hashLength)
    for (var i=0; i<hashLength; i++) {
      const hash = await getFilecoinInstance().methods.getIpfsHashByIndex(i, accounts[0]).call();
      const filename = await getFilecoinInstance().methods.getFileName(accounts[0], hash).call();
      const { config } = await getStorageConfig(hash);
      const detailsObj = {
        filename: filename,
        hash: hash,
        config: { ...config },
      }
      ipfsHasharray.push(detailsObj);
    }
    this.setState({
      ipfsHasharray, vidoesLoading: false,
    });
  };

  render() {
    return (
      <Vidoes 
        ipfsHasharray={this.state.ipfsHasharray}
        vidoesLoading={this.state.vidoesLoading}
      />
    );
  }
}

export default VidoesContainer;
