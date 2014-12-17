# scouncil-v2

shh it's top secret

## Dependencies

+ `apache2`

+ `python3`

+ `php5` and `libapache2-mod-php5`

## Configure

### .htaccess
Make sure that your Apache2 configuration recognises `.htaccess` files, add these lines to your `apache2.conf` (usually in `/etc/apache2`):

```
<Directory /var/www> # assuming that your Apache DocumentRoot is /var/www
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
```

### Admin password
Consider changing your admin password in `admin/auth/.htpasswd` (I recommend David Walsh's [.htpasswd Username & Password Generator](http://davidwalsh.name/web-development-tools#htaccess-status-message)).
The default username is "admin" and the password is "default".
When editing `.htpasswd`, make sure that there is no newline at the end of the file.