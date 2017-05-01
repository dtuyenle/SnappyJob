# crawl
#bash ./crawler/crawl.sh

# import
echo "Import" &&
#bash ./import/import.sh &&

# get lat lon
echo "create lat lon" &&
#python ./crawler/util/location/generate_lat_long.py ziprecruiter &&
#python ./crawler/util/location/generate_lat_long.py snagajob &&
#python ./crawler/util/location/generate_lat_long.py shiftgig &&
#python ./crawler/util/location/generate_lat_long.py jobshiringnearme &&
#python ./crawler/util/location/generate_lat_long.py indeed &&
#python ./crawler/util/location/generate_lat_long.py groovejob &&
#python ./crawler/util/location/generate_lat_long.py coolworks &&
#python ./crawler/util/location/generate_lat_long.py care &&
python ./crawler/util/location/generate_lat_long.py snappyjob_dump


# convert date time
#python ./crawler/util/convert_time_string_to_object.py ziprecruiter &&
#python ./crawler/util/convert_time_string_to_object.py snagajob &&
#python ./crawler/util/convert_time_string_to_object.py shiftgig &&
#python ./crawler/util/convert_time_string_to_object.py jobshiringnearme &&
#python ./crawler/util/convert_time_string_to_object.py indeed &&
#python ./crawler/util/convert_time_string_to_object.py groovejob &&
#python ./crawler/util/convert_time_string_to_object.py coolworks &&
#python ./crawler/util/convert_time_string_to_object.py care &&
#python ./crawler/util/convert_time_string_to_object.py snappyjob_dump
