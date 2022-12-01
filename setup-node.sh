# Instal tools.
apt install wget curl

# Instal nodejs version 18.x.
curl -s https://deb.nodesource.com/setup_18.x | sudo bash
apt install nodejs -y
apt autoremove -y

# Show version.
echo -e ""
echo -e "NodeJs Version:"
node -v

echo -e ""
echo -e "NPM Version:"
npm -v

# Done.
echo -e ""
exit 0