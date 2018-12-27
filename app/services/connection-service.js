import Service from '@ember/service';
import Evented from '@ember/object/evented';
import Peer from 'peerjs';

import { none } from '@ember/object/computed';


const PEER_SERVER_KEY = 'lwjd5qra8257b9';

export default Service.extend(Evented, {
  initialize() {
    console.log('Initializing connection service');
    let peer = new Peer({key: PEER_SERVER_KEY});
    peer.on('open', id => this.set('peerId', id));
    peer.on('connection', connection => this._setupConnection(connection, true));
    this.set('peer', peer);
  },

  initializeStreamingPeer() {
    let peer = new Peer({key: PEER_SERVER_KEY});
    this.set('streamingPeer', peer);
  },

  isNotConnected: none('connection'),

  _setupConnection(connection, isMaster) {
    this.set('connectionClosed', false);
    this.set('isMaster', isMaster);
    this.set('connection', connection);
    connection.on('data', data => this.trigger('received', data));
    connection.on('close', () => {
      this.set('connectionClosed', true);
      this.trigger('closed')
    });
    this.trigger('connected');
  },

  connect(peerId) {
    let connection = this.get('peer').connect(peerId);
    this._setupConnection(connection, false);
  },
});
