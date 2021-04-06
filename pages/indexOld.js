// import * as React from "react";
import React, { Component } from 'react';
// import { CreateToken } from "slate-react-system";
// import { createPow } from "@textile/powergate-client";

import * as System from 'slate-react-system'

import { css } from '@emotion/react'
import { createPow } from '@textile/powergate-client'

// const PowerGate = createPow({ host: "http://0.0.0.0:6002" });
const PowerGate = createPow({ host: "http://0.0.0.0:6002" });

// class Example extends React.Component {
class Example extends Component {
  PG = null

  state = { token: null, info: null, addrsList: [] }

  componentDidMount = async () => {
    const FFS = await PowerGate.ffs.create();
    const token = FFS.token ? FFS.token : null;
    PowerGate.setToken(token);
    this.setState({ token });
  };

  _handleCreateToken = async () => {
    // const PowerGate = createPow({ host: "http://0.0.0.0:6002" });
    this.PG = createPow({ host: 'http://0.0.0.0:6002' })

    const FFS = await this.PG.ffs.create();
    const token = FFS.token ? FFS.token : null;
    this.PG.setToken(token);
    this.setState({ token });
  };

  _handleRefresh = async () => {
    const { addrsList } = await this.PG.ffs.addrs()
    const { info } = await this.PG.ffs.info()
    this.setState({ addrsList, info })
  }

  _handleCreateAddress = async ({ name, type, makeDefault }) => {
    const response = await PowerGate.ffs.newAddr(name, type, makeDefault);
    console.log(response);
  };

  _handleSubmit = async (data) => {
    try {
      const file = data.file.files[0];
      console.log(file)
      var buffer = [];
      // NOTE(jim): A little hacky...
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
      console.log(buffer);
      const { cid } = await PowerGate.ffs.addToHot(buffer);
      console.log("Cid: ",cid);
      const { jobId } = await PowerGate.ffs.pushStorageConfig(cid);
      console.log(jobId)
      // const cancel = PowerGate.ffs.watchJobs((job) => {
      //   console.log(job);
      // }, jobId); 
    } catch (error) {
      
    }
  };
  

  render() {
    const { token, info } = this.state
    return (
      <div>
      <System.CreateToken token={this.state.token} onClick={this._handleCreateToken} />
      <System.CreateFilecoinAddress onSubmit={this._handleCreateAddress} />
      <System.ButtonPrimary onClick={this._handleRefresh}>
          Refresh
        </System.ButtonPrimary>

        {info ? <System.FilecoinBalancesList data={info.balancesList} /> : null}
        <System.CreateFilecoinStorageDeal onSubmit={this._handleSubmit} />;

      </div>
    );
  }
}
export default Example;