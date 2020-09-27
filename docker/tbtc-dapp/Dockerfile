# Build environment
FROM node:11.15.0-alpine as build

ARG TBTC_DAPP_VERSION

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV SNAPSHOT_HOST "https://contract-artifacts.s3.us-east-2.amazonaws.com"
ENV SNAPSHOT_NAME "contract-artifacts"
ENV SNAPSHOT_VERSION="v1.1.0"

RUN apk add --no-cache git python make g++ && \
    rm -rf /var/cache/apk/*

RUN git clone https://github.com/keep-network/tbtc-dapp . && \
    git checkout v${TBTC_DAPP_VERSION}

RUN npm ci

# https://github.com/NoahZinsmeister/web3-react/issues/86
RUN sed -i 's/return chainId;/return 50;/g' node_modules/@web3-react/injected-connector/dist/injected-connector.esm.js

RUN wget $SNAPSHOT_HOST/$SNAPSHOT_NAME-$SNAPSHOT_VERSION.zip -O snapshot.zip && \
    unzip -o snapshot.zip && \
    cp -r artifacts/keep-core/*.json node_modules/@keep-network/keep-core/artifacts && \
    cp -r artifacts/keep-ecdsa/*.json node_modules/@keep-network/keep-ecdsa/artifacts && \
    cp -r artifacts/tbtc/*.json node_modules/@keep-network/tbtc/artifacts

COPY ./configs/bitcoin/config.json src/config/config.json
COPY ./configs/ethereum/config.json src/connectors/config.json

RUN npm run build

# Production environment
FROM nginx:1.17-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 80

## Set `daemon off` so the nginx is run in the foreground.
CMD ["nginx", "-g", "daemon off;"]
