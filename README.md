# Single Mingle

---

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Web stack](#built_using)

## 🧐 About <a name = "about"></a>

Single Mingle is a dating website allows users to locate other singles in their area. First, users fill out a brief bio and upload photos. They can then start viewing photos of other users who match their setting preferences.

## 🏁 Getting Started <a name = "getting_started"></a>

### Prerequisites

This is the complete list of dependencies to run this program.
<br>
You will need to run `npm install` to install them.

```
aws-sdk": "^2.678.0",
"axios": "^0.21.1",
"bcryptjs": "^2.4.3",
"connect-flash": "^0.1.1",
"ejs": "latest",
"express": "^4.17.1",
"express-ejs-layouts": "^2.5.0",
"express-session": "^1.17.0",
"jquery": "^3.5.0",
"jsdom": "^16.2.2",
"jsonwebtoken": "^8.5.1",
"method-override": "^3.0.0",
"moment": "^2.24.0",
"mongoose": "^5.9.7",
"multer": "^1.4.2",
"multer-s3": "^2.9.0",
"node-sass": "^4.14.1",
"passport": "^0.4.1",
"passport-facebook": "^3.0.0",
"passport-google-oauth20": "^2.0.0",
"passport-local": "^1.0.0",
"path": "^0.12.7",
"socket.io": "^2.3.0"
```

## 🎈 Usage <a name="usage"></a>

A .config folder will need to have the following keys:

- Mong Atlas database URI
- AWS client id and client secret from aws
- AWS S3 bucket name
- AWS Cloudfront URL and Cloudfront distribution id
- Facebook developer app id and secret
- Google developer app and id

## 🚀 Start The Program <a name = "deployment"></a>

To start the program you will need to go to the program directory and open up your terminal and

1. Type `npm install` to download all the dependencies.
2. Go to http://localhost:3000 and you will see the app running.

## ⛏️ Web Stack <a name = "built_using"></a>

- [Express](https://expressjs.com/) - Server Framework
- [Mongo Atlas](https://docs.atlas.mongodb.com/) - Database
- [EJS](https://ejs.co/) - Templating
- [Node js](https://nodejs.org/en/docs/) - Server Environment

## 📜 License <a name = "license"></a>

The MIT License (MIT)

Copyright (c) 2015 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
