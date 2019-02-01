#!/bin/sh

usage() {
    echo "Usage: $0 [-pv] [IMAGE_NAME]"
    echo
    echo "Options:"
    echo " -p : Pull images before running scan"
    echo " -v : verbose output"
    exit 1
}

redirect_stderr() {
    if [ "$VERBOSE" = 1 ]; then
        "$@"
    else
        "$@" 2>/dev/null
    fi
}

redirect_all() {
    if [ "$VERBOSE" = 1 ]; then
        "$@"
    else
        "$@" 2>/dev/null >/dev/null
    fi
}

PULL=0
VERBOSE=0

curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m) -o docker-compose
chmod +x docker-compose
export PATH="$PATH:$PWD"

while getopts ":phv" opt; do
    case $opt in
        p)
            PULL=1
            ;;
        v)
            VERBOSE=1
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            usage
            ;;
        h)
            usage
            ;;
    esac
done
shift $(($OPTIND -1))

BASEDIR=$(cd $(dirname "$0") && pwd)
cd "$BASEDIR"

if [ ! -f "docker-compose.yaml" ]; then
    echo "no docker-compose file found"
fi

[ "$PULL" = 1 ] && redirect_all docker-compose pull
redirect_stderr docker-compose run --rm scanner "$@"
ret=$?
redirect_all docker-compose down
exit $ret
