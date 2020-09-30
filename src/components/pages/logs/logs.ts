import { Component, Vue } from 'vue-property-decorator';
import WithRender from './logs.html';
import { info } from 'electron-log';
import LogViewer from '@femessage/log-viewer';
import WebSocket from 'ws';
import { system } from '@/store';
import { startWebSocketServer } from '@/lib';

@WithRender
@Component({
  components: {
    LogViewer,
  },
})
export default class Logs extends Vue {
  public logs = '';

  private _client: WebSocket;
  private _wsServer: WebSocket.Server;

  created() {
    this.connect();
  }

  beforeDestroy() {
    info('Closing ws server');
    this._wsServer?.close();
  }

  private async connect() {
    try {
      const { port, wsServer } = await startWebSocketServer(
        this.$route.params.name,
      );
      this._wsServer = wsServer;
      this._client = new WebSocket(`ws://localhost:${port}`);
      this._client.on('message', (log) => {
        this.logs += `\n${log}`;
      });
    } catch (error) {
      system.notify({ message: 'Unable to connect to the container', error });
    }
  }
}
