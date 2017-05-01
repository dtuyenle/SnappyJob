python ~/closebytuyen/script/crawler/crawl/ziprecruiter.py || true &&
python ~/closebytuyen/script/crawler/crawl/snagajob.py || true &&
#python ~/closebytuyen/script/crawler/crawl/shiftgig.py || true&&
python ~/closebytuyen/script/crawler/crawl/jobtocareer.py || true &&
python ~/closebytuyen/script/crawler/crawl/jobshiringnearme.py || true &&
python ~/closebytuyen/script/crawler/crawl/indeed.py || true &&
python ~/closebytuyen/script/crawler/crawl/groovejob.py || true &&
python ~/closebytuyen/script/crawler/crawl/careerbuilder.py || true &&

#python ./craiglist/crawl.py && 
python ~/closebytuyen/script/crawler/crawl/coolworks.py || true &&
python ~/closebytuyen/script/crawler/crawl/care.py || true &&
python ~/closebytuyen/script/crawler/crawl/simplyhired.py || true &&
#python ~/closebytuyen/script/crawler/crawl/linkedin.py || true &&


bash ~/closebytuyen/script/import/import.sh || true &&

python ~/closebytuyen/script/crawler/util/add_timedate_for_location.py snappyjob_dump || true &&
python ~/closebytuyen/script/crawler/util/convert_time_string_to_object.py snappyjob_dump || true &&
python ~/closebytuyen/script/crawler/util/remove_expire.py snappyjob_dump || true &&
python ~/closebytuyen/script/crawler/util/location/generate_lat_long.py snappyjob_dump || true &&

bash ~/closebytuyen/script/import/import_to_snappyjob.sh || true &&
# python ~/closebytuyen/script/crawler/util/location/generate_lat_long.py snappyjob || true &&

python ~/closebytuyen/script/crawler/util/add_timedate_for_location.py snappyjob || true &&
python ~/closebytuyen/script/crawler/util/convert_time_string_to_object.py snappyjob || true &&
python ~/closebytuyen/script/crawler/util/remove_expire.py snappyjob || true &&
python ~/closebytuyen/script/crawler/util/location/generate_lat_long.py snappyjob || true &&
python ~/closebytuyen/script/crawler/util/cleanUp.py snappyjob || true &&

node ~/closebytuyen/script/crawler/crawl/news.js || true &&
node ~/closebytuyen/script/backup/tips.js || true &&

node ~/closebytuyen/script/crawler/util/generateDetails.js || true &&
node ~/closebytuyen/script/nltk/categorize.js || true &&


python ~/closebytuyen/script/crawler/util/remove_dup.py snappyjob || true &&


echo 'DONE'