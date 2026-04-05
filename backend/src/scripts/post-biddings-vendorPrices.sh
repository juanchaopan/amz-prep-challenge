#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <biddingId>"
  exit 1
fi

BIDDING_ID="$1"

post_price() {
  local vendor_id="$1"
  local price="$2"

  curl -X POST http://localhost:3000/biddings/vendor-prices \
    -H "Content-Type: application/json" \
    -d "{\"biddingId\":\"${BIDDING_ID}\",\"vendorId\":\"${vendor_id}\",\"price\":${price}}"
}

post_price "vendor-001" 90
post_price "vendor-002" 200
post_price "vendor-003" 150
post_price "vendor-004" 180
post_price "vendor-005" 170
post_price "vendor-006" 160