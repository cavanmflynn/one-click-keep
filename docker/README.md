# Docker Images

> The Dockerfiles used to build the images that the one-click keep app needs to spin up nodes quickly across multiple operating systems.

_Warning: These images are not hardened and shouldn't be used to store real cryptocurrency. These images are intended solely to be used in private environments_

## Bitcoin Core

### Tags

- `0.20.1` ([bitcoind/Dockerfile](https://github.com/jamaljsr/polar/blob/master/docker/bitcoind/Dockerfile))
- `0.20.0` ([bitcoind/Dockerfile](https://github.com/jamaljsr/polar/blob/master/docker/bitcoind/Dockerfile))
- `0.19.1` ([bitcoind/Dockerfile](https://github.com/jamaljsr/polar/blob/master/docker/bitcoind/Dockerfile))
- `0.19.0.1` ([bitcoind/Dockerfile](https://github.com/jamaljsr/polar/blob/master/docker/bitcoind/Dockerfile))
- `0.18.1` ([bitcoind/Dockerfile](https://github.com/jamaljsr/polar/blob/master/docker/bitcoind/Dockerfile))

**Building the image**

```sh
$ cd bitcoind
$ docker build --build-arg BITCOIN_VERSION=<version> -t oneclickkeep/bitcoind:<version> .
```

Replace `<version>` with the desired bitcoind version (ex: `0.18.1`)

**Push to Docker Hub**

```sh
$ docker push oneclickkeep/bitcoind:<version>
```

# Out-of-Band Image Updates

> Note: These steps can only be performed by developers with commit access to this GitHub repo and push access to the Docker Hub repo

These docker images can be updated in-between one-click keep releases. This allows developers to use the latest node versions shortly after they are released, without needing to download and install a new version of one-click keep.

To make new docker image versions available:

1. Build the new docker image using the commands above
2. Push the image to Docker Hub
3. Update the [`docker/nodes.json`](https://github.com/cavanmflynn/one-click-keep/blob/master/docker/nodes.json) file
   - add the new version to the `versions` array of the associated implementation
   - update the `latest` property of the implementation if necessary
   - increment the root-level `version` number by `1`
4. Update the [`src/lib/constants.ts`](https://github.com/cavanmflynn/one-click-keep/blob/master/src/utils/constants.ts) file

Once the updated `nodes.json` file is committed to master, the new images can be used in one-click keep by following these steps:

1. Create a Network or view an existing Network
2. In the Network Designer sidebar, click on the **Show All Versions** toggle
3. At the bottom of the node list, click on the **Check for new Node Versions** link
4. A dialog will open displaying the new versions available
5. Click the **Add New Versions** button to begin using them
