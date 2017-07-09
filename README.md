
#Build cordova version
ng build --aot --target=production --environment=prod --output-path ../../Newscron-cordova/www/ --base-href .

cordova run ios --device
