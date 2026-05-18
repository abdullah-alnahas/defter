let _path = $state('/');

if (typeof window !== 'undefined') {
  _path = window.location.pathname;
  window.addEventListener('popstate', () => {
    _path = window.location.pathname;
  });
}

export function setPath(p) { _path = p; }

export const router = {
  get path() { return _path; },
  navigate(to) {
    if (to === _path) return;
    history.pushState({}, '', to);
    _path = to;
  },
};
