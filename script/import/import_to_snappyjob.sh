folder_name="${USER}--$(date +%Y-%m-%d-%h-%m)--snappyjob_dump"
mkdir "$folder_name"
cd "$folder_name"

mongoexport --db snappyjob_dump --collection contents --out contents.json
mongoexport --db snappyjob_dump --collection contacts --out contacts.json
mongoexport --db snappyjob_dump --collection locations --out locations.json
mongoexport --db snappyjob_dump --collection tags --out tags.json

mongoimport --db snappyjob --collection contents --type json --file contents.json --upsert --upsertFields _id
mongoimport --db snappyjob --collection contacts --type json --file contacts.json --upsert --upsertFields _id
mongoimport --db snappyjob --collection locations --type json --file locations.json --upsert --upsertFields _id
mongoimport --db snappyjob --collection tags --type json --file tags.json --upsert --upsertFields _id