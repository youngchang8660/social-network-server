const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: "No photo"
    },
    author: {
        type: ObjectId,
        ref: "user"
    }
})

mongoose.model('post', PostSchema);