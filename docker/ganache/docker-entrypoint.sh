#!/bin/sh
set -e

# containers on linux share file permissions with hosts.
# assigning the same uid/gid from the host user
# ensures that the files can be read/write from both sides
if ! id ganache > /dev/null 2>&1; then
  USERID=${USERID:-1000}
  GROUPID=${GROUPID:-1000}

  echo "adding user ganache ($USERID:$GROUPID)"
  groupadd -f -g $GROUPID ganache
  useradd -r -u $USERID -g $GROUPID ganache
fi

if [ $(echo "$1" | cut -c1) = "-" ]; then
  echo "$0: assuming arguments for ganache"

  set -- ganache "$@"
fi

if [ "$1" = "ganache" ] || [ "$1" = "ganache-cli" ]; then
  echo "Running as ganache user: $@"
  exec gosu ganache "$@"
fi

echo "$@"
exec "$@"
