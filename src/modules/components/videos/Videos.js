import BlockUI from 'react-block-ui';
import GoogleLoader from '../../shared/GoogleLoader';
import { Fragment } from 'react';

const Videos = ({ ipfsHasharray, vidoesLoading }) => (
  <div className="videos card">
    <div className="videos-header">
      <h3>Your Videos</h3>
    </div>
    <BlockUI
      tag="div"
      blocking={vidoesLoading}
      loader={<GoogleLoader height={50} width={50} />}
      className="full-screen"
    >
      <div className="videos-content">
        {
          !vidoesLoading && ipfsHasharray.length === 0 ? (
              <p className="no-content">You haven't uploaded videos yet</p>
            ) : (
            ipfsHasharray.map(name => (
              <div className="video-wrapper">
                <video 
                  controls 
                  src={"https://gateway.ipfs.io/ipfs/"+name.hash}
                  className="video-player"
                />
                <div className="video-details">
                  <div className="file-name">{name.filename || '-'}</div>
                  <div className="storage-details">
                    {
                      name.config && name.config.hot
                      && name.config.hot.enabled && (
                        <div className="ipfs-label">IPFS</div>
                      )
                    }
                    {
                      name.config && name.config.cold
                      && name.config.cold.enabled && (
                        <div className="filecoin-label">FILECOIN</div>
                      )
                    }
                  </div>
                </div>
              </div>
            ))
          )
        }
      </div>
    </BlockUI>
  </div>
);

export default Videos;
