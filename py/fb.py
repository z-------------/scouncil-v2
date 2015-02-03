#!/usr/bin/env python3

import urllib.request
import xmltodict
import json

print("Content-type: application/json\n")

response = urllib.request.urlopen("http://www.facebook.com/feeds/page.php?id=111469742304756&format=rss20")
response_text = response.read().decode("utf-8")

data = xmltodict.parse(response_text)
items = data["rss"]["channel"]["item"]
json = json.dumps(items)

print('{"entries":' + json + '}')
