import * as sapper from '@sapper/app';
import { state, useLocalStorage } from './stores';

sapper.start({
	target: document.querySelector('#sapper')
});

useLocalStorage(state, 'treedecide');