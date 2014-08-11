model-contrib
=============

The place for open source contributions built with [model.js](https://github.com/curran/model). Any and all contributions are welcome.

Check out the [project home page](http://curran.github.io/model-contrib/) for a listing of components and examples.

## Contributing

Pull requests welcome! Add modules under `modules` and examples under `examples`. Please put your name and the date (or month) of authorship at the bottom of your example `README.md` file for examples, and at the end of the documentation comments before the code begins for modules.

To create a new example, make a copy of the [starter example](http://curran.github.io/model-contrib/#/examples/starter) directory under `examples`. Feel free to add more top-level Bower dependencies.

## Workflow

The script `server.js` implements a simple static file server for development use. It is convenient to serve the examples locally during development.

 * to install required NPM packages, run `npm install`
 * launch a local development server by running `node server.js`
 * navigate to [http://localhost:8000/#/](http://localhost:8000/#/) to view what will be shown at [http://curran.github.io/model-contrib/#/](http://curran.github.io/model-contrib/#/)

After adding an example or module, you can update the home page Angular app and screenshots with the following steps:

 * run `gulp`, which will run the code through JSHint and create the Docco documentation for all examples (under `docs`).
 * run `node buildIndex.js`, which creates `index.json`. This data file is the database that powers the [project home page](http://curran.github.io/model-contrib/), which you can access locally at [http://localhost:8000/#/](http://localhost:8000/#/).
 * run `node generateThumbnails.js` to render a thumbnail of each example and puts it under the `thumbnails` directory.
 * refresh [http://localhost:8000/#/](http://localhost:8000/#/) to check that there are no errors in the rendered visualizations.
 * For modules, click on the module entry to check if the Docco documentation for your module looks good.
 * For examples, click on the example entry to check if the example viewer (which renders README.md into HTML) presents the example well.

Improvements to the Angular side of the example code viewer or home page are also welcome.

By Curran Kelleher August 2014
