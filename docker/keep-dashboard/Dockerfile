# Build environment
FROM node:11.15.0-alpine as build

ARG KEEP_DASHBOARD_VERSION

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
ENV ARTIFACTS_HOST "https://contract-artifacts.s3.us-east-2.amazonaws.com"
ENV ARTIFACTS_NAME "contract-artifacts"
ENV ARTIFACTS_VERSION="v1.1.0"

RUN apk add --no-cache git python make g++ && \
    rm -rf /var/cache/apk/*

RUN git clone https://github.com/keep-network/keep-core ./keep-core && \
    cd keep-core && \
    git checkout token-dashboard/v${KEEP_DASHBOARD_VERSION} && \
    mv solidity/dashboard/* ../ && \
    cd ../ && \
    rm -rf ./keep-core

RUN npm ci

COPY ./configs/ethereum/config.json src/config/config.json

RUN wget $ARTIFACTS_HOST/$ARTIFACTS_NAME-$ARTIFACTS_VERSION.zip -O artifacts.zip && \
    unzip -o artifacts.zip && \
    cp -r artifacts/keep-core/*.json node_modules/@keep-network/keep-core/artifacts && \
    cp -r artifacts/keep-ecdsa/*.json node_modules/@keep-network/keep-ecdsa/artifacts && \
    cp -r artifacts/tbtc/*.json node_modules/@keep-network/tbtc/artifacts

RUN npm run build

# Production environment
FROM nginx:1.17-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d

EXPOSE 80

## Set `daemon off` so the nginx is run in the foreground.
CMD ["nginx", "-g", "daemon off;"]
