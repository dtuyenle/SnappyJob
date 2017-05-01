# drop db snappy_dump
mongo snappyjob_dump --eval "db.dropDatabase()" &&


folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)"
mkdir ./import/"$folder_name"
cd ./import/"$folder_name"


echo "ziprecruter"
#ziprecruter
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--ziprecruiter"
mkdir "$folder_name"
cd "$folder_name"

mongoexport --db ziprecruiter --collection contents --out contents.json
mongoexport --db ziprecruiter --collection contacts --out contacts.json
mongoexport --db ziprecruiter --collection locations --out locations.json
mongoexport --db ziprecruiter --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 

rm -rf "$folder_name"

echo "snagajob"
#snagajob
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--snagajob"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db snagajob --collection contents --out contents.json
mongoexport --db snagajob --collection contacts --out contacts.json
mongoexport --db snagajob --collection locations --out locations.json
mongoexport --db snagajob --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"

echo "indeed"
#indeed
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--indeed"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db indeed --collection contents --out contents.json
mongoexport --db indeed --collection contacts --out contacts.json
mongoexport --db indeed --collection locations --out locations.json
mongoexport --db indeed --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"


echo "jobtocareer"
#jobtocareer
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--jobtocareer"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db jobtocareer --collection contents --out contents.json
mongoexport --db jobtocareer --collection contacts --out contacts.json
mongoexport --db jobtocareer --collection locations --out locations.json
mongoexport --db jobtocareer --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"



echo "groovejob"
#groovejob
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--groovejob"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db groovejob --collection contents --out contents.json
mongoexport --db groovejob --collection contacts --out contacts.json
mongoexport --db groovejob --collection locations --out locations.json
mongoexport --db groovejob --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"


echo "craiglist"
#craiglist
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--craiglist"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db craiglist --collection contents --out contents.json
mongoexport --db craiglist --collection contacts --out contacts.json
mongoexport --db craiglist --collection locations --out locations.json
mongoexport --db craiglist --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"


echo "care"
#care
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--care"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db care --collection contents --out contents.json
mongoexport --db care --collection contacts --out contacts.json
mongoexport --db care --collection locations --out locations.json
mongoexport --db care --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"


echo "shiftgig"
#shiftgig
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--shiftgig"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db shiftgig --collection contents --out contents.json
mongoexport --db shiftgig --collection contacts --out contacts.json
mongoexport --db shiftgig --collection locations --out locations.json
mongoexport --db shiftgig --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"

echo "coolworks"
#shiftgig
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--coolworks"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db coolworks --collection contents --out contents.json
mongoexport --db coolworks --collection contacts --out contacts.json
mongoexport --db coolworks --collection locations --out locations.json
mongoexport --db coolworks --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"

echo "jobshiringnearme"
#shiftgig
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--jobshiringnearme"
mkdir ../"$folder_name"
cd ../"$folder_name"

mongoexport --db jobshiringnearme --collection contents --out contents.json
mongoexport --db jobshiringnearme --collection contacts --out contacts.json
mongoexport --db jobshiringnearme --collection locations --out locations.json
mongoexport --db jobshiringnearme --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json
rm -rf "$folder_name"

echo "simplyhired"
#simplyhired
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--simplyhired"
mkdir "$folder_name"
cd "$folder_name"

mongoexport --db simplyhired --collection contents --out contents.json
mongoexport --db simplyhired --collection contacts --out contacts.json
mongoexport --db simplyhired --collection locations --out locations.json
mongoexport --db simplyhired --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"



echo "careerbuilder"
#careerbuilder
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--careerbuilder"
mkdir "$folder_name"
cd "$folder_name"

mongoexport --db careerbuilder --collection contents --out contents.json
mongoexport --db careerbuilder --collection contacts --out contacts.json
mongoexport --db careerbuilder --collection locations --out locations.json
mongoexport --db careerbuilder --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"


echo "linkedin"
#linkedin
folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--linkedin"
mkdir "$folder_name"
cd "$folder_name"

mongoexport --db linkedin --collection contents --out contents.json
mongoexport --db linkedin --collection contacts --out contacts.json
mongoexport --db linkedin --collection locations --out locations.json
mongoexport --db linkedin --collection tags --out tags.json

mongoimport --db snappyjob_dump --collection contents --type json --file contents.json 
mongoimport --db snappyjob_dump --collection contacts --type json --file contacts.json 
mongoimport --db snappyjob_dump --collection locations --type json --file locations.json 
mongoimport --db snappyjob_dump --collection tags --type json --file tags.json 
rm -rf "$folder_name"

