module.exports = {
  exportTrailingSlash: true,
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/dashboard/': { page: '/dashboard' },
    };
  }
};