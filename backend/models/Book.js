const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
title : {
    type: String,
    required: true
},
description : {
    type: String,
    required: true
},
price : {
    type: Number,
    required: true
},
category : {
    type: String,
    enum: [
        'competitive exams',
        'manga',
        'fiction',
        'self help',
        'engineering',
        'medical',
        'school',
        'language learning',
        'children',
        'biography',
        'religion'
    ],
    required: true
},
condition: {
    type: String,
    enum: ['new', 'like new', 'good', 'acceptable'],
    required: true
},
language : {
    type: String,
    enum: ['english', 'hindi', 'other'],
    required: true
},

images : [{type: String}],

seller : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
},
city : {
    type: String,
    required: true
},
isAvailable : {
    type: Boolean,
    default: true
},

type : {
    type: String,
    enum: ['sell', 'donate', 'exchange'],
    required: true
},

reviews: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
},
rating: {
    type: Number,
    default: 0
},
totalReviews: {
    type: Number,
    default: 0
},
totalRatings: {
    type: Number,
    default: 0
},
},
{timestamps: true}
)

module.exports = mongoose.model('Book', bookSchema);
