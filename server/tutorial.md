## tldr;
Here's the source code: https://github.com/cleechtech/react-jwt-starter 

Today we're going to build on a [previous tutorial](https://github.com/cleechtech/cleechtech.github.io/blob/master/posts/use%20express%2C%20angular%20and%20jwt%20to%20make%20a%20secure%20app.md) that secured a MEAN stack app with Json Web Tokens. For the uninitiated, JWT are like web browser cookies but better. We will use the same code but swap in React.js for Angular.js.

Clone the [MEAN example](https://github.com/cleechtech/node-jwt-intro) and delete angular or clone directly from this commit.


Install server side dependencies and start server:

```
$ npm i
$ node server
```
You will see nothing on `http://localhost:3000/`.

## Add React.js

Add these scripts to the bottom of `public/index.html`:

```
<script src="https://fb.me/react-0.14.0.min.js"></script>
<script src="https://fb.me/react-dom-0.14.0.min.js"></script>
```
A popular tool for React.js apps is [webpack](https://webpack.github.io/) it is similar to a combination of gulp.js and browserify. It packages everything up and lets you use commonJS syntax ie `require()` in the browser. It is cool but we are not going to use it for this tutorial.

We are going to use [babel.js](https://babeljs.io/) for ES6 goodness and does not require configuration from us.

Add script tag:

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
```

Make a `public/components/` folder and add some js files:

```
<script type="text/babel" src='components/register.js'></script>
  <script type="text/babel" src='components/login.js'></script>
```

We need the `type="text/babel"` or it will not work.

## First component

Add a div to `public/index.html`:

```
<div id='registerForm'></div>
```

```
var RegisterForm = React.createClass({
	render(){
		return (
			<h1>Hello react</h1>
		);
	}
});

ReactDOM.render(<RegisterForm />, document.getElementById('registerForm'));
```

That funky `render(){}` syntax. We don't need it but many examples use it. The arrow brackets around RegisterForm is JSX. Then there is your age old friend `getElementById`, vanilla javascript that tells React where to mount the component on the DOM.

In fact though we want a form, not an h1:

```
var RegisterForm = React.createClass({
	render(){
		return (
			<form>
				<input type='email' placeholder='Email address' className='form-control' />
				<input type='password'  placeholder='Password' className='form-control' />
				<input type='submit' className='btn btn-primary' value='Register' />
			</form>
		);
	}
});

ReactDOM.render(<RegisterForm />, document.getElementById('registerForm'));
```

In JSX there are small differences, use `className` instead of `class`. (class is a reserved word in javascripts).

# Submit the register form

So that is a static register form. Now we are going to add a custom method to this component to handle submitting the form. This is taken almost verbatim from the [Facebook getting started](https://facebook.github.io/react/docs/tutorial.html) tutorial, where it is under "Adding new comments".

```
var RegisterForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();

		var author = this.refs.email.value.trim();
		var text = this.refs.password.value.trim();

		// form validation goes here
		if (!text || !author) {
		  return;
		}

		console.log('form submitted!');
		// TODO: send request to the server
		this.refs.email.value = '';
		this.refs.password.value = '';
		return;
	},
	render(){
		return (
			<form onSubmit={this.handleSubmit}>
				<input type='email' ref='email' placeholder='Email address' className='form-control' />
				<input type='password' ref='password' placeholder='Password' className='form-control' />
				<input type='submit' className='btn btn-primary' value='Register' />
			</form>
		);
	}
});

ReactDOM.render(<RegisterForm />, document.getElementById('registerForm'));
```