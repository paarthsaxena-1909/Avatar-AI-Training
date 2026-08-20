#!/usr/bin/env bash

set -euo pipefail

readonly max_static_file_bytes=104857600
readonly deploy_videos=(take-web.mp4 face_detection.mp4)

for video in "${deploy_videos[@]}"; do
  if [[ ! -f "$video" ]]; then
    echo "FAIL: $video is missing"
    exit 1
  fi

  active_filter=$(git check-attr filter -- "$video" | awk '{print $3}')
  if [[ "$active_filter" == "lfs" ]]; then
    echo "FAIL: $video would be committed as a Git LFS pointer instead of the MP4"
    exit 1
  fi

  file_size=$(stat -c %s "$video")
  if (( file_size > max_static_file_bytes )); then
    echo "FAIL: $video exceeds Vercel's 100 MB Hobby static-file limit"
    exit 1
  fi

  if ! ffprobe -v error -select_streams v:0 \
    -show_entries stream=codec_name,pix_fmt \
    -of csv=p=0 "$video" | grep -qx 'h264,yuv420p'; then
    echo "FAIL: $video is not encoded as browser-safe H.264 yuv420p"
    exit 1
  fi
done

echo "PASS: deploy videos will be committed as complete, browser-safe MP4 assets"
