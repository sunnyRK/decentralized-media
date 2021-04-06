import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { toast } from 'react-toastify';

import AddFile from './AddFile';
import { _uploadToFilecoin, getDefaultStorageConfig, setDefaultStorageConfig } from '../../../utils';

class AddFileDialogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'both',
      uploadLoading: false,
      storageConfigLoading: false,
      storageConfig: {},
    };
  }

  async componentDidMount() {
    await this.handleStorageConfig();
  }

  handleStorageConfig = async () => {
    try {
      // this.setState({ storageConfigLoading: true });
      const { value } = this.state;
      const { defaultStorageConfig } = await getDefaultStorageConfig();
      const storageConfig = {
        ...defaultStorageConfig,
        cold: {
          ...defaultStorageConfig.cold,
          enabled: value === 'both' ? true : (value === 'filecoin' ? true : false )
        },
        hot: {
          ...defaultStorageConfig.hot,
          enabled: value === 'both' ? true : (value === 'ipfs' ? true : false )
        },
      };
      this.setState({ storageConfig, storageConfigLoading: false });
      return storageConfig; 
    } catch (error) {
      console.log('handleStorageConfig error=====', error);
    }
  }

  _handleSubmit = async (data) => {
    try {
      this.setState({ uploadLoading: true });
      const storageConfig =  await this.handleStorageConfig();
      await setDefaultStorageConfig(storageConfig);
      await _uploadToFilecoin(data);
      this.props.handleState({ isAddFileOpen: false, uploadLoading: false });
      window.location.reload();
      toast.success('File Successfully Uploaded' ,{
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log('error======', error);
        this.setState({ uploadLoading: false })
        toast.error('Something went wrong! Please try again later.' ,{
          position: toast.POSITION.TOP_RIGHT,
        });
    }
  };

  handleChange = (event) => {
    this.setState({
      value: event.target.value
    }, () => {
      this.handleStorageConfig();
    });
  };

  render() {
    const { uploadLoading, value, storageConfigLoading } = this.state;
    return (
      <Dialog
        className="custom-dialog custom-content-style"
        classes={{
          paperScrollPaper: 'paper-scroll-paper'
        }}
        open={this.props.openDialog}
        onEscapeKeyDown={() => this.props.handleState({ isAddFileOpen: false })}
      >
        <DialogTitle className="dialog-title">
          Add File
          <IconButton
            onClick={() => this.props.handleState({ isAddFileOpen: false })}
          >
            <CloseIcon />
          </IconButton>  
        </DialogTitle>
        <DialogContent className="dialog-content">
          <AddFile
            _handleSubmit={this._handleSubmit}
            handleChange={this.handleChange}
            value={value}
            uploadLoading={uploadLoading}
            storageConfigLoading={storageConfigLoading}
            storageConfigJSON={this.state.storageConfig}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default AddFileDialogContainer;
