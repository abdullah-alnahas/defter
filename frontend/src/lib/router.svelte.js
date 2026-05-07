let _path = $state(typeof window !== 'undefined' ? window.location.pathname : '/');

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    _path = window.location.pathname;
  });
}

export const router = {
  get path() { return _path; },
  navigate(to) {
    if (to === _path) return;
    history.pushState({}, '', to);
    _path = to;
  },
};
