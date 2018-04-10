# Mest

> A Contract Test Framework for TypeScript

[![Build Status](https://travis-ci.org/phodal/mest.svg?branch=master)](https://travis-ci.org/phodal/mest)
[![Coverage Status](https://coveralls.io/repos/github/phodal/mest/badge.svg?branch=master)](https://coveralls.io/github/phodal/mest?branch=master)
[![node](https://img.shields.io/node/v/mest.svg)](https://www.npmjs.com/package/mest) 
[![npm](https://img.shields.io/npm/v/mest.svg)](https://www.npmjs.com/mest)

Usage
---

1. install mest

```
npm install -g mest
```

2. run API compare 

```
mest -i data/url.csv
```

data example: 

```csv
url,interface
https://phodal.github.io/mest-test/error.json,mock/IError.ts
https://phodal.github.io/mest-test/moreerror.json,mock/IMoreIError.ts
https://phodal.github.io/mest-test/user.json,mock/IUser.ts

```

results:


```
-> API https://phodal.github.io/mest-test/error.json .
same key: message,documentation_url
local diff key: id, remote diff:
-> API https://phodal.github.io/mest-test/moreerror.json .
difference errors type -> api: array, interface -> string
-> API https://phodal.github.io/mest-test/user.json .
same key: login,id,avatar_url,url,html_url,followers_url,following_url,gists_url,starred_url,subscriptions_url,organizations_url,repos_url,events_url,received_events_url,type,site_admin,name,company,blog,location,email,hireable,bio,public_repos,public_gists,followers,following,created_at,updated_at
local diff key: avatar_id, remote diff: gravatar_id
```

License: MIT
---

[![Phodal's Idea](http://brand.phodal.com/shields/idea-small.svg)](http://ideas.phodal.com/)

© 2018 A [Phodal Huang](https://www.phodal.com)'s [Idea](http://github.com/phodal/ideas).  This code is distributed under the MIT license. See `LICENSE` in this directory.
