const express = require('express');
const session = require('express-session');
const fs = require('fs');

const app = express();

// 静态啊文件托管
app.use(express.static('public'));

// //配置虚拟目录 的静态web服务
// app.use('/static',express.static('public'));

// 配置中间件
app.use(session({
    secret: 'keyboard cat',
    name: 'session.id',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        // secure: true,
        maxAge: 1000 * 3600,
        }
}))

app.get('/', (req, res) => {
    readFile('login.html', res);
})

app.post('/login', (req, res) => {
    req.session.user = {
        name: 'zhangsan',
        password: 123456,
    }
    console.log('登录成功');
    res.redirect(301, 'http://localhost:3000/index');
    // res.send('登录成功');
})

app.get('/register', (req, res) => {
    readFile('register.html', res);
})

app.get('/index', (req, res) => {
    if (req.session.user) {
        readFile('index.html', res);
    } else {
        res.send('未登录');
    }
})

app.get('/userInfo', (req, res) => {
    if (req.session.user) {
        readFile('userInfo.html', res);
    } else {
        res.send('未登录');
    }
})

app.get('/adminInfo', (req, res) => {
    if (req.session.user) {
        readFile('adminInfo.html', res);
    } else {
        res.send('未登录');
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.json({
                code: 2,
                msg: '退出登录失败',
            })
            return;
        }
    })
    res.clearCookie('session.id');
    res.redirect('/');
})

app.listen(3000);

/****************************************函数分割线**********************************************************/
function readFile(fileName, res) {
    const fileReadStream = fs.createReadStream(fileName);
    let readContent = '';
    fileReadStream.on('data', chunk => readContent += chunk);
    fileReadStream.on('end', () => {
        console.log('read file over');
        res.send(readContent);
    })
    fileReadStream.on('err', () => console.log(err));
}