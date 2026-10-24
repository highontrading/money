#!/bin/bash
# Archival / stock clips for the IPO long-form, downloaded into public/raw/video and
# treated by process_footage.py into public/video (both git-ignored; credits in public/img/credits.json).
# Prelinger films: https://archive.org/download/<id>/<id>.mp4
# Commons clips: 720p/480p transcodes of the files named in credits.json.
set -eu
cd "$(dirname "$0")/.."
R=public/raw/video
N=$R/0803_Vista_Stock_Shots_New_York_Stock_Exchange_13_00_55_00.mp4
P=$R/0525_Printing_E01105_00_40_38_11.mp4
B=$R/0537_Banks_and_Credit_19_41_46_04.mp4
f() { python3 tools/process_footage.py "$@"; }
f floor_wide $N 300 8 --gamma 0.5;   f floor_crowd $N 40 8 --gamma 0.55;  f floor_slips $N 56 8 --gamma 0.6
f press_rollers $P 24 7;             f press_roll $P 240 8;               f type_hands $P 160 8;  f press_big $P 376 8 --gamma 0.8
f bank_teller $B 72 8;               f bank_loan $B 32 7;                 f cheque_write $B 192 8
f bell_ring $R/bell_pse.webm 300 6 600 640 --crop "iw*0.4:ih*0.68:iw*0.3:0"
f chai_pour $R/chai_pour.webm 4 8 540 720 --crop "iw*0.42:ih:iw*0.29:0"
f mumbai_skyline $R/mumbai_street1.webm 2 8
f train_platform $R/local_train.webm 10 8;  f train_crowd $R/local_train.webm 40 8
