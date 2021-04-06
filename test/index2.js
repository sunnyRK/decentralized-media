// const { JobStatus } = require("@textile/grpc-powergate-client/dist/ffs/rpc/rpc_pb")
// import fs from "fs"
// import { createPow } from "@textile/powergate-client"

const fs = require("fs");
const {ffsTypes} = require("@textile/powergate-client");
const { createPow } = require("@textile/powergate-client")
// import { createPow } from "@textile/powergate-client"

const host = "http://0.0.0.0:6002" // or whatever powergate instance you want

const pow = createPow({ host })

async function exampleCode () {
    try {
        
        const { status, messagesList } = await pow.health.check()

        const { peersList } = await pow.net.peers()
        const { token } = await pow.ffs.create() // save this token for later use!
        console.log(token)
        pow.setToken(token)

        // get wallet addresses associated with your FFS instance
        const { addrsList } = await pow.ffs.addrs()
        // console.log(addrsList)

        // // create a new address associated with your ffs instance
        const { addr } = await pow.ffs.newAddr(addrsList[0].addr)
        // console.log(addr)

        // // get general info about your ffs instance
        const { info } = await pow.ffs.info()
        // console.log(info)
    
        // // cache data in IPFS in preparation to store it using FFS
        const buffer = fs.readFileSync(`/home/sunny123/Blockchain/test.png`)
        // console.log(buffer)
        const { cid } = await pow.ffs.stage(buffer)
        console.log(cid)
    
        // // // store the data in FFS using the default storage configuration
        const { jobId } = await pow.ffs.pushStorageConfig(cid)
        // console.log(jobId)
    
        // // // watch the FFS job status to see the storage process progressing
        // // const jobsCancel = pow.ffs.watchJobs((job) => {
        // //   if (job.status === JobStatus.JOB_STATUS_CANCELED) {
        // //     console.log("job canceled")
        // //   } else if (job.status === JobStatus.JOB_STATUS_FAILED) {
        // //     console.log("job failed")
        // //   } else if (job.status === JobStatus.JOB_STATUS_SUCCESS) {
        // //     console.log("job success!")
        // //   }
        // // }, jobId)
    
        // // // watch all FFS events for a cid
        const logsCancel = pow.ffs.watchLogs((logEvent) => {
        //   console.log(`received event for cid ${logEvent.cid}`)
        }, cid)
    
        // // // get the current desired storage configuration for a cid (this configuration may not be realized yet)
        const { config } = await pow.ffs.getStorageConfig(cid)
        // // console.log(config)
    
        // // // get the current actual storage configuration for a cid
        // const { cidInfo } = await pow.ffs.show(cid)
        // console.log(cidInfo)
    
        // // // retrieve data from FFS by cid
        const bytes = await pow.ffs.get(cid)
        // console.log(bytes)

        await fs.writeFile('/home/sunny123/Blockchain/HackFS/test4.png', new Buffer(bytes), callback)
    
        // // send FIL from an address managed by your FFS instance to any other address
        // await pow.ffs.sendFil(addrsList[0].addr, "<some other address>", 1000)
    
    } catch (error) {
        console.log(error)   
    }

}

var callback = (err) => {
    if (err) {
        console.log(err)
        throw err;
    } else {
        console.log('It\'s saved!');
    }
  }

  exampleCode();