import { createPow } from "@textile/powergate-client";
import * as System from 'slate-react-system'
import web3 from "../../../config/web3";
import {getFilecoinInstance} from "../../../config/contractinstance";
// const PG = createPow({ host: "https://grpcweb.slate.textile.io" });
const PG = createPow({ host: "http://0.0.0.0:6002" });
let userToken = null;

export const PowerGate = PG;

export const _handleCreateToken = async () => {
  try {
    const FFS = await PG.ffs.create();
    const token = FFS.token ? FFS.token : null;
    return token; 
  } catch (error) {
    console.log(error)
  }
};

export const _setToken = (token) => {
  try {
    console.log("Filecoin Token: ", token);
    userToken = token;
    PG.setToken(token); 
  } catch (error) {
    console.log(error)
  }
}

export const _handleInfo = async (token) => {
  try {
    const { addrsList } = await PG.ffs.addrs();
    const { info } = await PG.ffs.info();
    return { addrsList, info }; 
  } catch (error) {
    console.log(error)
  }
}

export const _uploadToFilecoin = async (data) => {
  try {    
    const accounts = await web3.eth.getAccounts();

    const file = data.file.files[0];
    console.log('file=====', file);
    var buffer = [];
    const getByteArray = async () =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = function (e) {
          if (e.target.readyState == FileReader.DONE) {
            buffer = new Uint8Array(e.target.result);
          }
          resolve();
        };
        reader.readAsArrayBuffer(file);
      });
    await getByteArray();

    const { cid } = await PG.ffs.stage(buffer);
    const { jobId } = await PG.ffs.pushStorageConfig(cid);
    let jobDetails;
    const cancel = PG.ffs.watchJobs((job) => {
      console.log('job====', job);
      jobDetails = job;
    }, jobId);
    // const bytes = await PG.ffs.get(cid);
    await getFilecoinInstance().methods.UploadNewIpfsHash(cid, file.name).send({
      from: accounts[0]
    });
    return { cid, jobDetails };

  } catch (error) {
    console.log('_uploadToFilecoin error====', error)
  }
};

export const getDefaultStorageConfig = async () => {
  try {
    const { defaultStorageConfig } = await PG.ffs.defaultStorageConfig();
    return { defaultStorageConfig }; 
  } catch (error) {
    console.log(error) 
  }
}

export const setDefaultStorageConfig = async (storageConfig) => {
  try {
    console.log(storageConfig);
    await PG.ffs.setDefaultStorageConfig(storageConfig);
    return true; 
  } catch (error) {
    console.log('setDefaultStorageConfig error===', error);
  }
}

export const getStorageConfig = async (cid) => {
  try {
    const { config } = await PG.ffs.getStorageConfig(cid);
    return { config };
  } catch (error) {
    console.log('getStorageConfig error====', error);
  }
}