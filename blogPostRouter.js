const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {app, runServer, closeServer} = require('./server');
const {BlogPosts} = require('./model');

BlogPosts.create('How to stay active', 'It is a mental and physical thing', 'Vic Tai', 'February 2nd, 2017');
BlogPosts.create('How to scare off intruders', 'Bark and Bark at everything', 'Marley and Honey', 'March 1st, 2016')
BlogPosts.create('How to make the best Mac-and-cheese', 'The secret is eggs', 'Olynthia', 'January 15th, 1984');

router.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i<requiredFields.length; i++) {
	const field = requiredFields[i];
		if (!(field in req.body)) {
  			const message = `Missing \`${field}\` in request body`
  			console.error(message);
  			return res.status(400).send(message);
		}
	}
  	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
  	res.status(201).json(item);
});

router.put('/blog-posts/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
  	for (let i=0; i<requiredFields.length; i++) {
    	const field = requiredFields[i];
    	if (!(field in req.body)) {
      		const message = `Missing \`${field}\` in request body`
      		console.error(message);
      		return res.status(400).send(message);
    	}
  	}
  	if (req.params.id !== req.body.id) {
   		const message = (
    		`Request path id (${req.params.id}) and request body id `
    		`(${req.body.id}) must match`);
    	console.error(message);
    	return res.status(400).send(message);
  	}
  	console.log(`Updating blog posts item \`${req.params.id}\``);
  	const updatedItem = BlogPosts.update({
    	id: req.params.id,
    	name: req.body.name,
    	title: req.body.title,
    	content: req.body.content,
    	author: req.body.author,
    	publishDate: req.body.publishDate
  	});
  	res.status(204).json(updatedItem);
});

router.delete('/blog-posts/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
  	console.log(`Deleted Blog Post item \`${req.params.ID}\``);
  	res.status(204).end();
});

module.exports = router;