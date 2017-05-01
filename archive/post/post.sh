#!/bin/bash
for i in $(seq 1 10)
do
	python post.py>foo.out 2>foo.err &
	python new_post.py>foo_new.out 2>foo_new.err &
done
wait
