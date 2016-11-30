const $ = require('jquery');
// Require all static files
// require.context('./static/', true, /^\.\/.*\.*/);

// require.context('./css/', true, /\.scss$/);
require('./css/main.scss');

const section = require('./page/index/section.html');
const footer = require('./page/index/footer.html');

$('body').html(section);
$('body').append(footer);
