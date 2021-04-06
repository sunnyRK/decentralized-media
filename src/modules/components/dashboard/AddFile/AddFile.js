import React from 'react';
import dynamic from 'next/dynamic';
import { FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { CreateFilecoinStorageDeal } from "slate-react-system";
import BlockUI from 'react-block-ui';
import GoogleLoader from '../../../shared/GoogleLoader';

const DynamicReactJson = dynamic(import('react-json-view'), { ssr: false });
const AddFile = ({
  handleChange, _handleSubmit, value,
  uploadLoading, storageConfigJSON,
  storageConfigLoading,
}) => (
  <BlockUI
    tag="div"
    blocking={uploadLoading || storageConfigLoading}
    loader={<GoogleLoader height={50} width={50} />}
    className="full-screen"
  >
    <div className="add-file-dialog">
      <div className="left-section">
        <div className="default-settings form-field">
          <FormControl>
            <label className="heading">Uploads to</label>
            <div></div>
            <RadioGroup aria-label="server" name="server1" value={value} onChange={handleChange}>
              <FormControlLabel value="ipfs" control={<Radio classes={{ root: 'radio-style-root' }} />} label="IPFS" />
              <FormControlLabel value="filecoin" control={<Radio classes={{ root: 'radio-style-root' }} />} label="Filecoin" />
              <FormControlLabel value="both" control={<Radio classes={{ root: 'radio-style-root' }} />} label="Both" />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="add-file-details form-field">
          <label className="heading">Add File</label>
          <div className="file-details">
            <CreateFilecoinStorageDeal onSubmit={_handleSubmit} />
          </div>
        </div>
      </div>
      <div className="right-section">
        <div className="storage-config-json">
          <DynamicReactJson
            src={storageConfigJSON}
            collapsed={true}
            name="FFS-json"
          />
        </div>
      </div>
    </div>
  </BlockUI>
);

export default AddFile;
