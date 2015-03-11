#!/usr/bin/env python3

import cgi
import os

form = cgi.FieldStorage()

print("Content-Type: text/plain\n");

if form["fname"]:
    try:
        open("../admin/content/" + form["fname"].value, "a").close()
        print("OK")
    except Exception as inst:
        print("ERROR: couldn't write file")
        print(str(inst))
else:
    print("ERROR: missing 'fname' parameter")