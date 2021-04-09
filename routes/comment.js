const express = require('express');
const router = express.Router();
const {
    post,
    comment
} = require('../models/postSchema.js')

const User = require('../models/userSchema')
const cors = require('cors');
const localUrl = 'http://localhost:8080'
const url = 'https://vue-test-47cc0.web.app'
const corsUrl = 'https://stormy-mountain-28848.herokuapp.com'
router.use(cors({
    credentials: true,
    origin: {
        url,
        localUrl,
        corsUrl
    }
}))
const getIo = (req, postId) => {
    const message = postId
    req.app.io.emit('updatePost', message)
}
router.post('/getcomments', (req, res) => {
    const { postId } = req.body
    if (postId) {
        post.findOne({ _id: postId }, (err, data) => {
            res.send(data.child)
        })
    } else res.send('body error')
})
router.post('/', (req, res) => {
    const { Comment, postId } = req.body
    console.log(Comment);
    if (Comment) {
        const userId = req.session.user_id
        User.findOne({ _id: userId }, (err, usr) => {
            const comentPost = new comment({
                userName: usr.userName,
                comment: Comment
            })
            comentPost.save().then(() => {
                post.findOneAndUpdate({ _id: postId }, { $addToSet: { child: comentPost } }).then(() => {
                    getIo(req, postId)
                    res.send('success')
                })
            })
        })
    }
    else res.send('error')
})
router.post('/deletecomment', (req, res) => {
    const { commentId, postId } = req.body
    console.log(commentId);
    comment.findByIdAndDelete({ _id: commentId }).then(() => {
        post.findByIdAndUpdate({ _id: postId }, { $pull: { child: { _id: commentId } } }).then(() => {
            res.send('success')
        }).catch((err) => {
            res.send(err)
        })
    })
})

module.exports = router