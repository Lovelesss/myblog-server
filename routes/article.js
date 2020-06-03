const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', function(req, res, next) {
    // let sql = `insert into user(username, password, role) values("liuyi", "123456", 'admin')`
});
// 添加文章
router.post('/add', function(req, res ,next) {
    const title = req.body.title;
    const desc = req.body.desc;
    const categoryName = req.body.categoryName;
    const mdStr = escape(req.body.mdStr);
    const htmlStr = escape(req.body.htmlStr);
    const sql = `insert into article(title, article_desc, category_name, scan_number, like_number, collect_number) values('${title}', '${desc}', '${categoryName}', 0, 0, 0)`;
    const sql2 = `insert into article_content(title, md_str, html_str) values('${title}','${mdStr}','${htmlStr}')`;
    db.query(sql, (err, result) => {
        if(err){
            console.log(err)
        }
        else {
            console.log(result);
            db.query(sql2, (err2, result2) => {
                if(err2) {
                    console.log(err2)
                } else {
                    // console.log(result2)
                    res.json({
                        status: 0,
                        msg: '发布成功',
                        result: result2
                    })
                }
            })
        }
    })
})
// 获取单篇文章
router.get('/content', function(req, res, next) {
    const title = req.query.title;
    console.log(title);
    let sql = `select * from article join article_content on article.title = article_content.title where article.title = "${title}"`;
    db.query(sql, (err, result) => {
        if (err || result.length === 0) {
            res.json({
                status: 1,
                msg: '查询错误',
                result: err
            })
        } else {
            res.json({
                status: 0,
                msg: '查询成功',
                result: result
            })
        }
    })
});


// 获取文章列表
router.get('/list', function(req, res, next) {
    const page = req.query.page;
    const limit = req.query.limit;
    const startNumber = (page - 1) * limit;
    // const sql = `select * from article inner join article_content on article.title = article_content.title order by update_time desc`
    const sql  = `select * from article inner join article_content on article.title = article_content.title order by update_time desc limit ${startNumber},${limit}`
    const img_sql = 'select image_url from image';
    let imageList;
    db.query(img_sql, (err2, result2) => {
        if (err2) {
            console.log(err2)
            res.json({
                result: err2
            })
        } else {
            console.log(result2)
            imageList = result2;
            db.query(sql, (err, result) => {
                if(err) {
                    console.log(err)
                } else {
                    result.forEach((item ,index) => {
                        const length = imageList.length - 1;
                        const random = Math.floor(Math.random() * length) + 1;
                        item.imgUrl = imageList[random].image_url
                    });
                    res.json({
                        status: 0,
                        msg: '发布成功',
                        result: result
                    })
                }
            })
        }
    });
});
// 获取文章标题列表
router.get('/title-list', function(req, res, next) {
    // let sql = `insert into user(username, password, role) values("liuyi", "123456", 'admin')`
});
module.exports = router
