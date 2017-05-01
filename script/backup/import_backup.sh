mongoimport --db snappyjob --collection contents --type json --file snappyjob/contents.json --upsert --upsertFields _id
mongoimport --db snappyjob --collection contacts --type json --file snappyjob/contacts.json --upsert --upsertFields _id
mongoimport --db snappyjob --collection locations --type json --file snappyjob/locations.json --upsert --upsertFields _id
mongoimport --db snappyjob --collection tags --type json --file snappyjob/tags.json --upsert --upsertFields _id