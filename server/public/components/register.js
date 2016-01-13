
var RegisterForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();

		var _email = this.refs.email.value.trim();
		var _password = this.refs.password.value.trim();

		// form validation goes here
		if (!_email || !_password) {
		  return;
		}

		// send request to the server
		$.ajax({
			type: "POST",
			dataType: 'json',
			url: '/api/users',
			data: {
				email: _email,
				password: _password
			},
			success: function(data) {
				console.log('data');
				var _token = data.token;
				var _decoded = jwt_decode(_token);

				// decoded data from our JSON web token
				console.log(_decoded);
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});

		// reset form
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