import detectPort from 'detect-port';
import { debug, error } from 'electron-log';
import { PassThrough } from 'stream';
import Docker from 'dockerode';
import WebSocket from 'ws';

/**
 * Starts a web socket server in order to stream logs from the docker
 * container to the log component. The log component unfortunately cannot
 * accept a stream directly, so we have a spin up a local WS server
 * just to proxy the logs.
 * @param name the name of the docker container
 * @returns the port that the web socket server is listening on
 */
export const startWebSocketServer = async (
  name: string,
): Promise<{ port: number; wsServer: WebSocket.Server }> => {
  const port = await detectPort(0);
  const wsServer = new WebSocket.Server({ port });
  const docker = new Docker();
  wsServer.on('connection', async (socket) => {
    debug(`getting docker container with name '${name}'`);
    const containers = await docker.listContainers();
    debug(`all containers: ${JSON.stringify(containers)}`);
    const details = containers.find((c) => c.Names.includes(`/${name}`));
    debug(`found: ${JSON.stringify(details, null, 2)}`);
    const container = details && docker.getContainer(details.Id);
    if (!container) {
      throw new Error(`Docker container '${name}' not found`);
    }

    // Get a stream of docker logs
    const dockerStream = await container.logs({
      follow: true,
      tail: 500,
      stdout: true,
      stderr: true,
    });
    // Demux and merge stdin and stderr into one stream
    const logStream = new PassThrough();
    container.modem.demuxStream(dockerStream, logStream, logStream);
    // Proxy logs from docker thru the web socket
    logStream.on('data', (data: Buffer) => socket.send(data.toString('utf-8')));
    // Log errors
    logStream.on('error', (e) => error('logStream Error', e));
    // Kill server if the container goes down while the logs window is open
    container.wait(() => {
      socket.send('\n** connection to docker terminated **\n\n');
      socket.close();
      wsServer.close();
    });
  });
  return {
    port,
    wsServer,
  };
};
