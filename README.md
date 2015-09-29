# Learning Durandal with Pluralsight

Uses Require.js, jQuery, and Knockout.js for data binding.

Durandal is all about _Composition_. Composes smaller pieces into a larger application.

## Setup

Download and extract [html starter kit](durandaljs.com/downloads.html) to a project directory.

```
npm install -g http-server
cd ${projectdir}
http-server
```

Durandal app is available at [http://localhost:8080](http://localhost:8080)

## Add a view

Add `helloOSX.html` in `views` directory and `helloOSX.js` in `viewmodels` directory.

Durandal html templates always have a container element, example a `<div>`.

Html elements can have data binding to variables in the corresponding viewModel, for example:

```html
<h1 data-bind="text: message"></h1>
```

For the view model, call `define({...})` with object properties.
These properties represent the data that the view can bind to. For example:

```javascript
define({
  message: 'Hello, OSX'
});
```

Last step is to configure this view in the router. Router configuration is in `shell.js`.
Note that routes can have a title:

```
{ route: 'helloOSX', moduleId: 'viewmodels/helloOSX', title: 'Hello OS X', nav: true }
```
