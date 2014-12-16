# scouncil-v2

shh it's top secret

## Dependencies

+ `apache2`

+ `python3`

+ `php5` and `libapache2-mod-php5`

## Configure

To make sure that your Apache2 configuration recognises `.htaccess` files, add these lines to your `apache2.conf` (usually in `/etc/apache2`):

```
# apache2.conf
<Directory /var/www>
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
```
