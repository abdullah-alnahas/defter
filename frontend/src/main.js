import { hydrate, mount } from 'svelte';
import App from './App.svelte';

const target = document.getElementById('app');
const data = (typeof window !== 'undefined' && window.__DEFTER__) || {};
const props = { data };

if (target && target.hasChildNodes()) {
  hydrate(App, { target, props });
} else if (target) {
  mount(App, { target, props });
}
