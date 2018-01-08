const express = require('express');
const router = express.Router();
const bookModel = require('../model/bookModel');

// GEt all books.
router.get("/", (req, res, next) => {
    bookModel.find({}, (err, data) => {
        res.json(data);
    });
});

// Get available books.
router.get("/available", (req, res, next) => {
    bookModel.find({stock: {$gt: 0}}, (err, data) => {
        res.json(data);
    });
});

// Get specific book.
router.get("/:id", (req, res, next) => {
    bookModel.findOne({_id: req.params.id}, (err, data) => {
        res.json(data);
    });
});

// Post, create new book.
router.post("/", (req, res, next) => {
    new bookModel(req.body).save((err) => {
        if (err) {
            res.json(err);
        } else {
            res.json({created: req.body});
        }
    });
});

// Put, update book.
router.put("/:id", (req, res, next) => {
    let book = new bookModel(req.body);
    let validMessage = book.validateSync();
    if (validMessage) {
        return res.json(validMessage);
    }
    bookModel.findOneAndUpdate(
        {_id: req.params.id},
        {$set: req.body},
        {overwrite: true, new: true},
        (err, doc) => {
            if (err) {
                return res.json(err);
            }
            res.json({success: true});
        });
});

// Delete a book.
router.delete("/:id", (req, res, next) => {
    bookModel.findOneAndRemove({_id: req.params.id}, (err) => {
        res.json({success: true});
    });
});

// Put borrow.
router.put("/:id/borrow", (req, res, next) => {
    bookModel.findOneAndUpdate(
        {_id: req.params.id, stock: {$gt: 0}},
        {$inc: {stock: -1}},
        {overwrite: true, new: true},
        (err, data) => {
            if (err) {
                return res.json({error: err});
            } else if (!data) {
                return res.json({error: "Nincs kiadható könyv!"});
            }
            res.json({success: true, book: data});
        });
});

module.exports = router;
