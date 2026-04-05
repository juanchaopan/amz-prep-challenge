curl -X POST http://localhost:3000/biddings \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Need transport for 500kg cargo from 7975 Heritage Road, Brampton, Ontario, to 1140 Tristar Drive, Mississauga, Ontario. Timeline is 1 day. Cargo type is general.",
    "sender": "john@speedflex.com"
  }'