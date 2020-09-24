FROM mhart/alpine-node:10

ARG GANACHE_VERSION

WORKDIR /usr/src/app

RUN npm install -g ganache-cli@${GANACHE_VERSION}

ENV MNEMONIC "concert load couple harbor equip island argue ramp clarify fence smart topic"
ENV NETWORK_ID 50
ENV SNAPSHOT_HOST "https://ganache-snapshots.s3.us-east-2.amazonaws.com"
ENV SNAPSHOT_NAME "keep-tbtc-snapshot"
ENV TBTC_SOLIDITY_VERSION="v1.1.0"
EXPOSE 8545

CMD [ "sh", "-c", "echo downloading snapshot version: $TBTC_SOLIDITY_VERSION; wget $SNAPSHOT_HOST/$SNAPSHOT_NAME-$TBTC_SOLIDITY_VERSION.zip -O snapshot.zip && unzip -o snapshot.zip && ganache-cli --gasLimit 12000000 --allowUnlimitedContractSize=true --db $SNAPSHOT_NAME --noVMErrorsOnRPCResponse -p 8545 -e 10000 --keepAliveTimeout=40000 --networkId \"$NETWORK_ID\" -m \"$MNEMONIC\" -h 0.0.0.0"]
