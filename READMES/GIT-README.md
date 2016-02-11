### Welcome to the Git zone

###### GIT cheatsheet

```shell

# PULL from BitBucket hub
> git checkout develop
> git pull --rebase origin

# DELETE old local branches
# where add-widget is the name of the branch you want to delete
> git branch -d add-widget

# CREATE new branch named add-another-widget off of branch history develop
> git checkout -b add-another-widget

# ADD files to stage
> git add .
# or
> git add -A
# now all the files are added to stage to be comitted

# PUSH new branch to BitBucket
> git push origin add-another-widget
# now go create a PR (pull request) on BitBucket for this branch to be merged into develop branch


#
# other useful shortcuts
#


# add new hub / git remote called fish-sticks
> git remote add fish-sticks git@bitbucket.org:flikstarz/flik_dashboard_app.git
# now you will have a remote that you can push to called fish-sticks


# rename hub / git remote called fish-sticks to cat-house
> git remote rename fish-sticks cat-house
# now fish-sticks remote has been renamed to cat-house


# RESET git history (--soft) to a certain commit / treeish / certain point in gitland and keep changes made in working dir
# first get the commit treeish you want to reset to
> git log --oneline
# most likely it will be the last or right before the last commit
# then copy that hash / treeish for that commmit we will use it like so:
# where 1782709 is the treeish we want to reset to
> git reset --soft 1782709
# the history will now be reset to that point and the changes to the files in the working dir
# will be ready to stage again and commit the way you wanted to originally


# RESET WIPE git history (--hard) to a certain commit / treeish / certain point in gitland and WIPE changes made in working dir
# find the treeish you want to reset to then:
> git reset --hard 1782709
# now the history will be reset to that point and all changes to files in working dir discarded
```

#### Git aliases for can haz enjoy

* add these to your local or global .gitconfig file at the end

```shell
# use what you like - try them out to see
# take care with some of them they can mash your project / system if not used correctly

[alias]
  st = status
  rmt = remote -v
  plct = push livecat
  co = checkout
  mrg = merge
  ci = commit
  br = branch
  ai = add --interactive
  mctm = merge zcat
  cm = commit -m
  cma = commit -a -m
  amend = commit --amend
  caa = commit -a --amend -C HEAD
  save = !sh -c 'export PREV=$(git symbolic-ref HEAD|cut -d/ -f3-) && git checkout -b "$1" && git commit -am "$1" && git checkout "$PREV"' -
# rebase aliases
  reb3 = rebase -i HEAD~3
  reb5 = rebase -i HEAD~5
  reb7 = rebase -i HEAD~7
# list aliases
  la = "!git config -l | grep alias | cut -c 7-"
# log commands
    l = log --graph --pretty=format:'%C(yellow)%h%C(cyan)%d%Creset %s %C(white)- %an, %ar%Creset'
  lsd = log --graph --decorate --pretty=oneline --abbrev-commit --all
  hist = log --pretty=format:\"%h %ad | %s%d [%an]\" --graph --date=short
  fl = log -u
  le = log --oneline --decorate
  ll = log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --numstat
  ls1 = log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate
  lds = log --pretty=format:"%C(yellow)%h\\ %C(green)%ad%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=short --graph
  ls = log --pretty=format:"%C(green)%h\\ %C(yellow)[%ad]%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate --date=relative
  lnc = log --pretty=format:"%h\\ %s\\ [%cn]"
# diff aliases
  dr = "!f () { git diff "$1"^.."$1"; }; f"
  lc = "!f () { git diff "$1"^.."$1"; }; f"
  diffr = "!f () { git diff "$1"^.."$1"; }; f"
  dl = "!git ll -1"
  dlc = diff --cached HEAD^
  chgd = diff --name-only
# stash aliases
  stsh = stash
  stsl = stash list
  sts-unap = "!f () { git stash show -p stash@{"$1"} | git apply -R; }; f"
  sts-app = "!f () { git stash apply stash@{"$1"}; }; f"
# reset aliases
  reshd = reset --hard
# grep files
  cgrep = grep --color=always
  f = "!git ls-files | grep -i"
  grep = grep -Ii
  gr = grep -Ii --color
  gra = "!f() { A=$(pwd) && TOPLEVEL=$(git rev-parse --show-toplevel) && cd $TOPLEVEL && git grep --full-name -In $1 | xargs -0I{} echo $TOPLEVEL/{} && cd $A; }; f"
```

###### There are several workflows that are popular in dev land.

* here is a fantastic guide that explains and compares them [git workflow guide on atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows)
* We are using the workflow called Gitflow [this one](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

### Basically you follow the workflow up to the merge into Develop then you send a pull request at the end of the day

* sample workflow in shell
* first off get a prompt that tells you what branch you are on: recommended shell `zsh` with `pure` theme
* then you can remain sane and know what branch you are on at a glance

### Get `zsh` install `OHMYzsh` and then install and activate `pure` theme for prompt goodness

Here is a complete walkthrough if you need it [install zsh with Homebrew](http://zanshin.net/2013/09/03/how-to-use-homebrew-zsh-instead-of-max-os-x-default/)

> Install `zsh`

```shell
# install zsh
> brew install zsh
# add brew zsh to your shells file
> echo "/usr/local/bin/zsh" >> sudo tee -a /etc/shells
# to change to zsh do this
> zsh
# to exit back to your default shell
> exit
# to change the default shell to zsh for your user profile
> chsh -s /usr/local/bin/zsh
```

> Install `ohmyzsh`

```shell
# install ohmyzsh
> curl -L http://install.ohmyz.sh | sh
```

> Install and activate `pure` theme for git prompt and goodness

```shell
> npm -g install pure-prompt
# now add theme to .zshrc
> nano ~/.zshrc
# find the line that looks like the below:
ZSH_THEME="robbyrussel"
# and change it to this:
ZSH_THEME="pure"
# now you should have a prompt like this
/current/dir    gitbranch
>
# hooray
```

> you can use any of these tools if you like to butter up your `git` experience
> all are optional and just add a bit of sugar to the `git` spice

* `Tig` : to install `tig` do in shell
* [Readme for Tig on Github](https://github.com/jonas/tig/blob/master/INSTALL.adoc)

```shell
# use brew to install tig
> brew update
> brew install tig
```

> add these bindings to your `~/.tigrc` file. Create one if you don't have one and add these

```shell
# create tag
bind main T !@git tag -a %(prompt) %(commit)
# reset soft to tag
bind main E !@git reset --soft %(commit)
# amend last commit
bind status + !git commit --amend
# verbose amend last commit
bind status = !git commit –amend -v
# move quickly through diff
bind stage <Enter> :/^@@
# source ~/.tigrc file
bind generic S :source ~/.tigrc
# add / edit notes for selected commit
bind generic T !git notes edit %(commit)
# move up with arrow key in diff
bind diff <Up> move-up
# move down with arrow key in diff
bind diff <Down> move-down
# create new branch
bind refs n !@git branch "%(prompt Enter branch name: )"
# create new branch
bind refs B !@git branch "%(prompt Create branch name from selected branch history: )" %(branch)
# create tag from commit
bind main T !@git tag %(prompt) %(commit)
# stage files then select commit in main view and use this to add staged changes and fixup selected commit
bind main = !git commit –fixup=%(commit)
# put cursor above a group of commits in main view and it will attempt to autosquash selected commits - may fail
bind main R !git rebase –autosquash -i %(commit)
# push changes to github
bind status P !git push github
# push changes to bitbucket
bind status B !git push bitbucket
# intent to add - useful if want to add-patch a newly created file
bind status N !@git add -N %(file)
# open commit on github
bind generic B @sh -c "xdg-open 'https://'$(git remote -v | grep -Eo 'github.com[:/][^.]+' | head -1 | tr : /)'/commit/%(commit)'"
# patch file under
bind status P !git add --patch %(file)

```

* `gitsh` : to install `gitsh` use brew:
* [Readme for gitsh on Github](https://github.com/thoughtbot/gitsh)

```shell
# use brew to install gitsh
> brew update
> brew tap thoughtbot/formulae
> brew install gitsh
```

* `Hub` : install hub with brew:
* [Readme for Hub on Github](https://github.com/github/hub)

```shell
# use brew to install latest hub
> brew update
> brew install --HEAD hub
```


> Here is the sample workflow
> you can review the workflow in more detail in the [walkthrough](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

```shell
# first we checkout develop branch
> git checkout develop
# now we checkout a feature branch named add-widget off of branch develop to work on
> git checkout add-widget develop
# now we work and hack and work some
> git add .
> git commit -m "add widget buttons - fix fonts for widget header"
# work some more and then a little more
# this is a shorthand syntax to add unstaged changes and commit in one go
> git commit -a -m "add widget graphs - finish widget functions"
# if you have added files you will have to do
> git add -A
# this will add all changes to tracked files and add untracked files to stage
# then you can commit all the new files and changes
> git commit -a -m "add widget controller - add widget graphs - finish widget functions"
# then when you are finished with the branch you can merge it in to develop and make another
# branch off develop and start working off the feature branch like above
> git checkout develop
> git merge add-widget develop
# this will open an editor where you can write a commit message for the merge commit
# write a descriptive message for the feature branch merge and save the file and close it
# you should get dumped back to the shell with output from git informing you of the changes
# from the merge commit then you can submit a pull request to the hub on BitBucket
# otherwise you can also just submit a pull request for your feature branch to be merged into develop by me
# finally you can delete the branch and start another branch named after feature you will work on
> git pull
> git checkout another-feature develop
# work more -- hooray
```

* Make a pull request in the hub on BitBucket either for your feature branch or for develop to be merged into hub
* All collaborators will receive a notification
* Then your feature will then be merged into master properly and tagged with release tag by the hub maintainer (Jupiter).
* The updated master branch will be ready for all to pull again for the morning scrum
* During or right before the morning scrum pull the latest from the Github hub to make sure you have the latest at least in master
* If you have unsynced work `rebase` the changes from develop onto the feature branch you have the unsynced changes on
* Ex:

#### Only consider the below if you have changes that you haven't submitted a pull request for abd changes have been made on the main Github hub

* Please ask if you need clarity on these points or have any questions at all for the Git workflow

```shell
# if you are working on a feature branch called add-widget this is how to rebase

# checkout the feature branch you are working on
> git checkout add-widget
# rebase the changes from develop onto your current branch
> git rebase develop
# now your branch has all the changes from the main Github hub played on top of your Git history
# you can continue working using the Gitflow-workflow normally at this point
```

* After scrum start or after you pull the latest from the bitbucket hub then delete old merged and stale branches  -- Hooray ^-^
* Ex:

```shell
# delete already merged in and stale branches
# where add-widget is the name of the branch we want to delete
> bit branch -d add-widget
```
