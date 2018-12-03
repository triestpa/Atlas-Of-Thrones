#!/bin/bash
gsutil rsync -d -x '.*\.DS_Store$' -r ./public gs://atlasofthrones.com
