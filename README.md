model-contrib
=============

The place for open source contributions built with [model.js](https://github.com/curran/model).

Check out the [project home page](http://curran.github.io/model-contrib/) for a listing of components and examples.

## Contributing

Pull requests welcome! Add modules under `modules` and examples under `examples`. Please put your name and the date (or month) of authorship at the bottom of your example `README.md` file for examples, and at the end of the documentation comments before the code begins for modules.

## Workflow

The script `server.js` implements a simple static file server for development use.

 * to install required NPM packages, run `npm install`
 * launch a local development server by running `node server.js`
 * navigate to [http://localhost:8000/#/](http://localhost:8000/#/) to view what will be shown at [http://curran.github.io/model-contrib/#/](http://curran.github.io/model-contrib/#/)

After adding an example or module, please do the following to update the project home page:

 * run `node buildIndex.js`, which creates `index.json`
 * run `node generateThumbnails.js`, which renders a thumbnail of each example and puts it under the `thumbnails` directory
 * refresh [http://localhost:8000/#/](http://localhost:8000/#/) to check that there are no errors

Improvements to the Angular side of the example code viewer or home page are also welcome.

By Curran Kelleher August 2014
