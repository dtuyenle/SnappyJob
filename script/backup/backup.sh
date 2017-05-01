rm -rf snappyjob
folder_name="snappyjob"
mkdir "$folder_name"
cd "$folder_name"


mongoexport --db snappyjob --collection contents --out contents.json
mongoexport --db snappyjob --collection applys --out applys.json
mongoexport --db snappyjob --collection contactusses --out contact_us.json
mongoexport --db snappyjob --collection contacts --out contacts.json
mongoexport --db snappyjob --collection crawler_email --out crawler_email.json
mongoexport --db snappyjob --collection locations --out locations.json
mongoexport --db snappyjob --collection tags --out tags.json

