#!bin/bash
node scrape_mediawiki.js
node download_summaries.js
node add_summaries_to_db.js