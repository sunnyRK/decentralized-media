// import fs from "fs"
// import { ffsTypes } from "@textile/powergate-client"

const fs = require("fs");
const {ffsTypes} = require("@textile/powergate-client");
const { createPow } = require("@textile/powergate-client")

const host = "http://0.0.0.0:6002" // or whatever powergate instance you want

const pow = createPow({ host })

const pow2 = createPow({ host })
onsubmit = async () => {
    // event.preventDefault();
    try {

        var addreses = [];
        // var addrsList = [];
        // for (i=0;i<3;i++) {

            const { status, messageList } = await pow.health.check()

            const { peersList } = await pow.net.peers()

            const { token } = await pow.ffs.create() // save this token for later use!

            console.log(token)
            pow.setToken(token)

            // // get wallet addresses associated with your FFS instance
            const { addrsList } = await pow.ffs.addrs();
            console.log(addrsList[0].addr)

            console.log(addrsList)

            // create a new address associated with your ffs instance
            const { addr } = await pow.ffs.newAddr(addrsList[0].addr);
            console.log("addr: ", addr)
            addreses.push(addr)
        // }

        console.log(addreses)
        const { status1, messageList1 } = await pow2.health.check()

        const { peersList1 } = await pow2.net.peers()

        const { token1 } = await pow2.ffs.create() // save this token for later use!

        console.log(token1)
        pow2.setToken(token1)

        // // // get wallet addresses associated with your FFS instance
        // const { addrsList1 } = await pow2.ffs.addrs();
        // console.log(addrsList1[0].addr)

        // // create a new address associated with your ffs instance
        // const { addr1 } = await pow2.ffs.newAddr(addrsList1[0].addr);
        // console.log("addr: ", addr1)


        // const { status1, messageList1 } = await pow.health.check()

        // const { peersList1 } = await pow.net.peers()

        // const { token1 } = await pow.ffs.create() // save this token for later use!

        // console.log(token1)
        // pow.setToken(token1)

        // const { addrsList2 } = await pow.ffs.addrs();
        // console.log(addrsList2[0].addr)

        // // create a new address associated with your ffs instance
        // const { addr1 } = await pow.ffs.newAddr(addrsList2[0].addr);
        // console.log("addr1: ", addr1)

        // // get general info about your ffs instance
        const { info } = await pow.ffs.info();
        console.log(info)

        // // // cache data in IPFS in preparation to store it using FFS
        const buffer = fs.readFileSync(`/home/sunny123/Blockchain/HackFS/transfer.png`)
        const { cid } = await pow.ffs.addToHot(buffer)
        console.log("cid: ", cid);

        // // // // store the data in FFS using the default storage configuration
        const { jobId } = await pow.ffs.pushConfig(cid)
        console.log(jobId)

        // // console.log(ffsTypes)

        // // watch the FFS job status to see the storage process progressing
        // const cancel2 = await pow.ffs.watchJobs((job) => {
        // if (job.status === ffsTypes.JobStatus.CANCELED) {
        //     console.log("job canceled")
        // } else if (job.status === ffsTypes.JobStatus.FAILED) {
        //     console.log("job failed")
        // } else if (job.status === ffsTypes.JobStatus.SUCCESS) {
        //     console.log("job success!")
        // }
        // }, jobId)

        // // // // watch all FFS events for a cid
        const cancel = pow.ffs.watchLogs((logEvent) => {
        // console.log(`received event for cid ${logEvent.cid}`)
        }, cid)

        // // // // get the current desired storage configuration for a cid (this configuration may not be realized yet)
        const { config } = await pow.ffs.getCidConfig(cid)

        // // // // get the current actual storage configuration for a cid
        const { cidinfo } = await pow.ffs.show(cid)

        // // // // retreive data from FFS by cid
        const bytes = await pow.ffs.get(cid)
        // console.log("hi")
        await fs.writeFile('/home/sunny123/Blockchain/HackFS/powergate-test/transfer-filecoin.png',new Buffer(bytes), callback)

        // console.log(bytes)

        // // senf FIL from an address managed by your FFS instance to any other address
        await pow.ffs.sendFil(addreses[2], addreses[1], 1000)
        
    } catch (error) {
        console.log(error);
    }
};


var callback = (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  }

onsubmit();