# scouncil-v2

shh it's top secret

## Dependencies

+ `apache2`

+ `python3`

+ `php5` and `libapache2-mod-php5`

## Configure

Add these lines to your `php5.conf` (to allow execution of inline PHP in HTML):

```
<FilesMatch "\.html$">
    ForceType application/x-httpd-php
</FilesMatch>
```