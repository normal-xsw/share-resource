 const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./modules/db');

const app = express();

// 静态啊文件托管
app.use(express.static('public'));

// 设置中间件，处理表单
// parse application/x-www-form-urlencode
app.use(bodyParser.urlencoded({ extended: false }));

// parse application json
app.use(bodyParser.json());


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

app.post('/dologin', (req, res) => {
    console.log(req.body);

    const username = req.body.username;
    const password = req.body.password;

    db.find('users', {name: username}, (err, data) => {
        if (err) {
            console.log('查询数据库失败');
            res.status(200).json({data: '查询数据库失败'});
            res.end();
            return;
        }

        console.log(data);

        if (data.length === 0) {
            res.status(200);
            res.json({data: '账户不存在'});
            // res.json({data: '密码不正确'});
            res.end();
             return;
        } else {
            if (password !== data.password) {
            res.status(200);
            res.json({data: '密码不正确'});
            res.json({data: '密码不正确'});
            res.end();
             return;
            // res.redirect(301, 'http://localhost:3000');
            } else {
                req.session.user = {
                    name: username,
                    password: password,
                }
                console.log('登录成功');
                res.redirect(301, 'http://localhost:3000/index');
            }
        }
    })

    // req.session.user = {
    //     name: 'zhangsan',
    //     password: 123456,
    // }
    // console.log('登录成功');
    // res.redirect(301, 'http://localhost:3000/index');
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