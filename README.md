


#Update angular
sudo npm uninstall -g @angular/cli
npm uninstall --save-dev angular-cli
rm -rf node_modules dist && rm package-lock.json
npm cache verify
npm install -g @angular/cli@latest
npm install --save-dev @angular/cli@latest
npm install

#Build cordova version
npm run build-prod-cordova
