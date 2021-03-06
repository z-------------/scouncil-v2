# scouncil-v2

shh it's top secret

## Dependencies

+ [`apache2`](http://httpd.apache.org/)

+ [`python3`](https://www.python.org/downloads/)

+ [`php5`](http://php.net/downloads.php)

+ `libapache2-mod-php5`

+ [`xmltodict`](https://github.com/martinblech/xmltodict)

## Configure

### .htaccess
Make sure that your Apache2 configuration recognises `.htaccess` files, add these lines to your `apache2.conf` (usually in `/etc/apache2`):

```apache
<Directory /var/www> # assuming that your Apache DocumentRoot is /var/www
	Options Indexes FollowSymLinks
	AllowOverride All
	Require all granted
</Directory>
```

### Admin password
Consider changing your admin password in `admin/auth/.htpasswd` (To properly encode it, use David Walsh's [.htpasswd Username & Password Generator](http://davidwalsh.name/web-development-tools#htaccess-status-message)).

The default username is "admin" and the password is "default".

When editing `.htpasswd`, make sure that there is **no newline** at the end of the file, otherwise the server will become confused and hurt itself. It's not very effective.

### One more thing
The `.htaccess` file inside `admin/auth` assumes that your `DocumentRoot` is `/var/www`. **If it isn't**, please change `admin/auth/.htaccess` accordingly:

Find this line:

`AuthUserFile /var/www/admin/auth/.htpasswd`

and replace `/var/www` with the path of your `DocumentRoot` (if it isn't `/var/www`)