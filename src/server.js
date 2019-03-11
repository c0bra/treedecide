import compression from 'compression';
import getPort from 'get-port';
import polka from 'polka';
import sirv from 'sirv';
import * as sapper from '@sapper/server';

let { PORT, NODE_ENV } = process.env;
PORT = PORT || getPort();
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
