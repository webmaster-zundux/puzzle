# Generation ssl certification for development and testing environment

```sh
$ sudo apt install mkcert
$ sudo apt install libnss3-tools

$ mkcert -install
Created a new local CA
The local CA is now installed in the system trust store! ⚡️
The local CA is now installed in the Firefox trust store (requires browser restart)!

$ cp .env.testing .env

$ mkdir .ssl

$ cd .ssl

$ mkcert localhost

```

Note: more information at [mkcert (https://github.com/FiloSottile/mkcert)](https://github.com/FiloSottile/mkcert)

## Creating certificates for multiple domains

```sh

$ mkcert example.com "*.example.com" example.test localhost 127.0.0.1 ::1

Created a new certificate valid for the following names
- "example.com"
- "*.example.com"
- "example.test"
- "localhost"
- "127.0.0.1"
- "::1"

The certificate is at "./example.com+5.pem" and the key at "./example.com+5-key.pem"

```
