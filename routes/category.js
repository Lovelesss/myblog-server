const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 获取分类列表
router.get('/', function (req, res, next) {
    let sql = 'select * from category';


    db.query(sql, (err, result) => {
        if (err || result.length === 0) {
            res.json({
                status: 1,
                msg: '查询分类失败',
                result: err
            })
        } else {
            res.json({
                status: 0,
                msg: '查询分类成功',
                result: result
            })
        }
    })
});

// 获取当前分类文章列表
router.get('/article', function (req, res, next) {
    const categoryName = req.query.categoryName;
    const img_sql = 'select image_url from image';
    let imageList, sql;
    if (categoryName === '全部') {
        sql = `select * from article order by update_time desc`;
    } else {
        sql = `select * from article where category_name = "${categoryName}" order by update_time desc`;
    }
    db.query(img_sql, (err, result) => {
        imageList = result
    });
    db.query(sql, (err, result) => {
        if (err) {
            res.json({
                status: 1,
                msg: '查询文章列表失败',
                result: err
            })
        } else {
            result.forEach((item ,index) => {
                const length = imageList.length - 1;
                const random = Math.floor(Math.random() * length) + 1;
                item.imgUrl = imageList[random].image_url
            });
            res.json({
                status: 0,
                msg: '查询文章列表成功',
                result: result
            })
        }
    })
});

module.exports = router
