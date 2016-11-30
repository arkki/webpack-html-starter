# Webpack test app with generated HTML

Quick POC of using Webpack as module-loader and automagically generating HTML.

## Features

1.  Modular JS/CSS/configs, modular everything
1.  CSS modules / local scope
1.  Automatic HTML generation via html-webpack-plugin
1.  ES6 in configs
1.  Live reload on webpack-dev-server


## Install and run

To clone from git bundle:

~~~
git clone -b master webpack-app.bundle
cd wbepack-app
~~~

NPM install from package.json:

~~~
npm install
~~~

Start the server (using webpack-dev-server) running *in-memory*:

~~~
npm start
~~~

Build static resources (using webpack) to folder **./build**:

~~~
npm run build
~~~

Code testing and linting (currently using eslint and stylelint):

~~~
npm run test
~~~


## More resources

Version 1.x:

[https://webpack.github.io/docs/what-is-webpack.html](https://webpack.github.io/docs/what-is-webpack.html)
[https://webpack.github.io/docs/tutorials/getting-started/](https://webpack.github.io/docs/tutorials/getting-started/)
[https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.xhu0mx7z9](https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460#.xhu0mx7z9)

Note! Version 2 is coming but no ETA yet.
