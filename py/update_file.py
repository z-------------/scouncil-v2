#!/usr/bin/env python3

import cgi

form = cgi.FieldStorage()

print("Content-Type: text/plain\n");

if form["fname"]:
    try:
        data = form["data"].value
    except:
        data = ""
    file_name = form["fname"].value

    f = open("../admin/content/" + file_name, "w")
    f.write(data)

    print("OK")
else:
    print("ERROR")