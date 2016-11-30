const $ = require('jquery');

require('../../../css/main.scss');
require('./override.css');

const main = require('./main.html');

$('body').html(main);
