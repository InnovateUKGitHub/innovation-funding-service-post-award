useradd -m -G sudo ifspa

export npm_config_cache=npm-cache

echo "apt-get update"
apt-get update

echo "installing linux dependencies"
apt-get install -y xvfb xauth libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6

echo "installing chromium"
apt install -y chromium

# "set +e" and corresponding "set -e" are temporary.
# Remove when errors should result in failure.

echo "listing cypress dir"
ls

echo "Running cypress tests"

echo "Listing TEST_URL and BASIC_AUTH"
echo $TEST_URL
echo $BASIC_AUTH
set +e
echo "run npm ci"
npm ci

echo "running tests"
npm test
set -e