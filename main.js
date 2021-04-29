require("dotenv").config();
const express = require("express");
const Mux = require("@mux/mux-node");
const ngrok = require('ngrok');
const {Video} = new Mux(
    process.env.MUX_TOKEN_ID,
    process.env.MUX_TOKEN_SECRET
);
const app = express();
const port = 4000;

(async function() {
    const url = await ngrok.connect({addr : port});
    console.log('Tunnel Created -> ', url);
    console.log('Tunnel Inspector ->  http://127.0.0.1:4040');
  })();

app.get('/', (req, res) => {
    res.send('This is the tunnel created by Ngrok with Http Auth');
});


app.post('/newStream',async(req,res)=>{

    try{
        const newStream = await Video.LiveStreams.create({
            playback_policy: 'public',
            new_asset_settings: { playback_policy: 'public' }
        });  
    
        res.json({
            test:newStream.test,
            stream_key:newStream.stream_key,
            status:newStream.status,
            reconnect_window:newStream.reconnect_window,
            playback_ids:newStream.playback_ids,
            new_asset_settings:newStream.new_asset_settings,
            id:newStream.id,
            created_at:newStream.created_at
        });
    }catch(err){
        console.log(err);
    }

});

app.get('/live-streams', async (req, res) => {
    try{
        const liveStreams = await Video.LiveStreams.list();
        res.json(liveStreams.map((liveStream) => ({
            id: liveStream.id,
            status: liveStream.status,
            playback_ids: liveStream.playback_ids,
            created_at: liveStream.created_at
        })));
    }catch(err){
        console.log(err);
    }
   
});

app.get('/assets', async (req, res) => {
    try{
    const Assets = await Video.Assets.list();
    console.log("ASSET CALLED");
    res.json(Assets.map((asset) => ({
        id: asset.id,
        status: asset.status,
        playback_ids: asset.playback_ids,
        created_at: asset.created_at
    })));
    }catch(err){
        console.log(err);
    }
});

app.listen(port,()=>{
    console.log('MUX API listening on port '+ port);
});

