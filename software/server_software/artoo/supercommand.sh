#!/bin/bash

git add . && git commit -m "new functions" && git push origin master\
ssh s0s@192.168.44.230  'cd sos/artoo | git pull origin'