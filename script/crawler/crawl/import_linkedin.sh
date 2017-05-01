

mongoimport --db linkedin --collection contents --type json --file contents.json 
mongoimport --db linkedin --collection contacts --type json --file contacts.json 
mongoimport --db linkedin --collection locations --type json --file locations.json 
mongoimport --db linkedin --collection tags --type json --file tags.json 


rm -rf contents.json
rm -rf contacts.json
rm -rf locations.json
rm -rf tags.json