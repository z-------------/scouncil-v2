#!/usr/bin/env python3

import urllib.request

print("Content-type: application/json\n")

response = urllib.request.urlopen("http://www.facebook.com/feeds/page.php?id=111469742304756&format=json")
response_text = response.read().decode("utf-8")

print(response_text)
