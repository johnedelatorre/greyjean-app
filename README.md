#### NOTE : If you have already installed read this, if not continue to #1:

```shell
# update our deps
$ > bower install && npm install
```

1: Install NodeJS, Grunt and Bower

##### install node.js

* go to [NodeJS site](http://nodejs.org/) - download the correct package for your OS and install it
go to the app root

#### now make it so you dont need to use sudo with npm
`$ npm config set prefix ~/npm`
* then

```shell
# append to .bashrc or .zshrc
export PATH="$PATH:$HOME/npm/bin"
```

* now you can install npm modules without using sudo

### install grunt, grunt-cli, and bower

```shell
> cd frontend
> npm install -g grunt-cli grunt bower browser-sync json-server foreman 6to5
> npm install
> bower install
# to run dev build task
> grunt build:dev
# to run server
> nf start
# to stop server use ctrl+c or ctrl+z
```

* Now you can hack on the files in `src/`

* DONT edit the files in `dist/` they will be mowed on each build
* DONT edit the files in `transpiled/` they will be mowed on each build

-----

### LOCAL

* UPDATE : How we push the dashboard to the server now


* first open your SSH config file
** this will create one if you don't have one already

```shell
> sudo nano ~/.ssh/config
#
# make an entry like this
# IMPORTANT : adjust ~/path/to/your/pemfile/ to the actual path to your pemfile
# if there are other entries already just append it
#
Host flikdash
    User ubuntu
    HostName 54.148.115.179
    IdentityFile ~/path/to/your/pemfile/newtom.pem
#
# now we can ssh like so
#
> ssh flikdash
#
# there was much rejoicing -- YAY
# now we can add our git remote to push to the server like so
#
> git remote add server flikdash:~/repos/flikdashboard.git
#
# now we can push to the server remote and it will automatically checkout the files
# to our specified endpoint in the post-receive hook which is /var/www/html
#
> git push server master
# there was more rejoicing -- YAY
```

----

### SERVER

* Tomcat should be running already on :8080

* if not do this

```shell
> sudo service tomcat7 start
# or
> sudo service tomcat7 restart
# to stop
> sudo service tomcat7 stop
```


#### Node should also be running on :3001
* if not never fear:

```shell
> cd /var/www/html
> ws
# should see something like
# serving src/ at http://localhost:3001
# you can stop the server with ctrl+c
# to leave it running and exit your shell type:
> screen
# you will enter a "screen" now you can type:
> ws
# after to exit the screen and return to the shell do
# ctrl + a + d
# you will be returned to the previous shell
# to rejoin that screen - first list all the screens with:
> screen -ls
# you will see something like
# There is a screen on:
#        31337.pts-0.ip-172-31-2-95 (12/26/2014 09:06:45 AM)      (Detached)
# 1 Socket in /var/run/screen/S-ubuntu.
# you will see the screen that you left running to reattach do:
#
> screen -r 31337
# where 31337 is the ID of the screen you want to reattach to
# to kill the screen session just reattach then :
> exit
# just logging out from the screen session will kill it
#
```

#### Apache should be running on :80
* if not :

```shell
> sudo service apache2 restart
# or
> sudo service apache2 start
# to stop
> sudo service apache2 stop
#
# there was much rejoicing -- HOORAY
```
