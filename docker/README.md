# Docker Images

> The Dockerfiles used to build the images that the one-click keep app needs to spin up nodes quickly across multiple operating systems.

_Warning: These images are not hardened and shouldn't be used to store real cryptocurrency. These images are intended solely to be used in private environments_

## Bitcoin Core

### Tags

- `0.20.1` ([bitcoind/Dockerfile](https://github.com/cavanmflynn/one-click-keep/blob/master/docker/bitcoind/Dockerfile))

**Building the image**

```sh
$ cd bitcoind
$ docker build --build-arg BITCOIN_VERSION=<version> -t oneclickkeep/bitcoind:<version> .
```

Replace `<version>` with the desired bitcoind version (ex: `0.20.1`)

## ElectrumX

### Tags

- `0.20.1` ([electrumx/Dockerfile](https://github.com/cavanmflynn/one-click-keep/blob/master/docker/electrumx/Dockerfile))

**Building the image**

```sh
$ cd electrumx
$ docker build --build-arg KEEP_NETWORK_ELECTRUMX_COMMIT=<commit_id> -t oneclickkeep/electrumx:<version> .
```

Replace `<commit_id>` with the desired keep-network/electrumx commit id (ex: `629a609b44af8f0e810ebc67242cc0bf5f3cd1e2`) and  `<version>` with the desired image version (ex: `1.15.0`)

## Ganache (Ethereum)

### Tags

- `6.10.2` ([ganache/Dockerfile](https://github.com/cavanmflynn/one-click-keep/blob/master/docker/ganache/Dockerfile))

**Building the image**

```sh
$ cd ganache
$ docker build --build-arg GANACHE_VERSION=<version> -t oneclickkeep/ganache:<version> .
```

Replace `<version>` with the desired ganache-cli version (ex: `6.10.2`)

## KEEP Beacon

### Tags

- `1.3.0` ([keep-beacon/Dockerfile](https://github.com/cavanmflynn/one-click-keep/blob/master/docker/keep-beacon/Dockerfile))

**Building the image**

```sh
$ cd keep-beacon
$ docker build --build-arg KEEP_BEACON_VERSION=<version> -t oneclickkeep/keep-beacon:<version> .
```

Replace `<version>` with the desired keep beacon version (ex: `1.3.0`)

## KEEP ECDSA

### Tags

- `1.2.0` ([keep-ecdsa/Dockerfile](https://github.com/cavanmflynn/one-click-keep/blob/master/docker/keep-ecdsa/Dockerfile))

**Building the image**

```sh
$ cd keep-edsa
$ docker build --build-arg KEEP_ECDSA_VERSION=<version> -t oneclickkeep/keep-ecdsa:<version> .
```

Replace `<version>` with the desired keep ecdsa version (ex: `1.2.0`)

## tBTC dApp

### Tags

- `0.17.3` ([keep-ecdsa/Dockerfile](https://github.com/cavanmflynn/one-click-keep/blob/master/docker/tbtc-dapp/Dockerfile))

**Building the image**

```sh
$ cd tbtc-dapp
$ docker build --build-arg TBTC_DAPP_VERSION=<version> -t oneclickkeep/tbtc-dapp:<version> .
```

Replace `<version>` with the desired tbtc dapp version (ex: `0.17.3`)

## KEEP Dashboard

### Tags

- `1.3.3` ([keep-ecdsa/Dockerfile](https://github.com/cavanmflynn/one-click-keep/blob/master/docker/keep-dashboard/Dockerfile))

**Building the image**

```sh
$ cd keep-dashboard
$ docker build --build-arg KEEP_DASHBOARD_VERSION=<version> -t oneclickkeep/keep-dashboard:<version> .
```

Replace `<version>` with the desired keep dashboard version (ex: `1.3.3`)

**Push to Docker Hub**

```sh
$ docker push oneclickkeep/bitcoind:<version>
```

```sh
$ docker push oneclickkeep/ganache:<version>
```

```sh
$ docker push oneclickkeep/keep-beacon:<version>
```

```sh
$ docker push oneclickkeep/keep-ecdsa:<version>
```

```sh
$ docker push oneclickkeep/electrumx:<version>
```

```sh
$ docker push oneclickkeep/tbtc-dapp:<version>
```

```sh
$ docker push oneclickkeep/keep-dashboard:<version>
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
