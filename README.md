<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Learning Durandal with Pluralsight](#learning-durandal-with-pluralsight)
  - [Setup](#setup)
  - [Add a view](#add-a-view)
  - [Conventions and Architecture](#conventions-and-architecture)
    - [Model View Patterns](#model-view-patterns)
      - [View](#view)
      - [Model](#model)
      - [ViewModel](#viewmodel)
    - [AMD](#amd)
    - [App Flow](#app-flow)
      - [index.html](#indexhtml)
      - [main.js](#mainjs)
      - [shell viewModel](#shell-viewmodel)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

## Conventions and Architecture

### Model View Patterns

Variations such as MVC (controller), MVP (presenter), MVVM (viewModel).
They all have in common separation of view from state and behaviour.

Durandal calls itself MV*. Can be used with any of the above patterns. This course will use MVVM.

#### View

HTML and stylesheets. Responsbile for visual portion of application. Has no behaviour.

#### Model

Knowledge behind the application, has all data and application logic.

#### ViewModel

Lies in between the view and the model. Data bound to the view.

As user updates the view, viewModel gets updated.

When viewModel gets updated, view is updated as well.

ViewModel holds the state for the view and handles the functionality.

ViewModel also has access to the model, and can pass user actions out to the model to execute application logic,
and then update the view as needed.

View and ViewModel are central to Durandal. Every page in the application has a View and ViewModel pair.
They have the same name except for the file extension.

### AMD

Asynchronous module defintion. Durandal uses RequireJS to provide AMD functionality.

Some AMD conventions include:

One module per JavaScript file. Name of module is the filename, minus the `.js` extension.

A module is defined by calling the `define()` method, which comes from RequireJS.

Simplest module definition is a module literal:

```javascript
// simplePage.js
define({
  message: 'Hello, World!'
});
```

This module is a singleton, there is only one instance of it in the application.

A more advanced usage is to pass a function to define, and the return value of the function
is the public interface of the module.

```javascript
define(function() {
  var helloMessage = 'Hello, World!';

  return {
    message: helloMessage
  };
});
```

If you need a non-singleton, can create a constructor function in the define, and return it as the public interface.

```javascript
define(function() {
  var ctor = function(message) {
    this.message = message;
  };

  return ctor;
});
```

Then any other module that needs this can new up an instance of this module using the constructor function.

Can also bring in dependencies by specifying string array of modules you depend on.
Module paths are relative to the application folder.

```javascript
define(['model/messages', 'util/logger'],
  function(messages, logger) {

    var ctor = function() {
      logger.log('Creating new simplePage module');
      this.message = messgaes.helloMessage;
    };

    return ctor;

});
```

### App Flow

1. Starts at `index.html` which uses RequireJS to load the `main` module.
1. `main` configures RequireJS and starts the application by loading the `shell` view.
1. `shell` view configures the Router
1. The router loads all the other pages in the application

#### index.html

This is the single page. All views will be loaded into the `applicationHost` div.

```html
<div id="applicationHost">
    <div class="splash">
        <div class="message">
            Durandal Starter Kit
        </div>
        <i class="fa fa-spinner fa-spin"></i>
    </div>
</div>
```

Script tag that loads RequireJS. `data-main` contains relative path to the main module.

```html
<script src="lib/require/require.js" data-main="app/main"></script>
```

#### main.js

This is the main entry point to the application. First thing it does is to configure RequireJS
by wiring up paths to modules. Paths are like aliases to longer path names

`system.debug` turns on debug level logging. It's wrapped in a RequireJS optimization pragma
to exclude it from the production bundle.

```javascript
//>>excludeStart("build", true);
system.debug(true);
//>>excludeEnd("build");
```

`app.title` will be concatenated with each page title and displayed in the browser title.

```javascript
app.title = 'Durandal Starter Kit';
```

Configure plugins, Durandal ships with some core plugins, then you can add others or write your own.

```javascript
app.configurePlugins({
    router:true,
    dialog: true
});
```

Finally, start the application. Start is a function that returns a promise.

When app starts, make a call to `viewLocator.useConvention()` to make use of convention where
all views live in the `views` folder and all modelViews live in the `modelView` folder.

This is ok for small apps, but doesn't scale to larger. If `useConvention` is not called,
Durandal will look for view and viewModel in _same_ folder. This supports organization by component or features.

And then set the initial view for the application.

```javascript
app.setRoot('viewmodels/shell', 'entrance');
```

#### shell viewModel

Router is configured here by setting it as a property on the returned object.

Router mappings are specified in the `activate` function.

Activate is a special property on a viewModel and is part of the page lifecycle.
It's called by Durandal when the view is loaded.

Each route entry in the router array represents a page in the application.

Router watches the url and loads different pages accordingly.

Empty string in route entry means this route is also the default view.

Setting nav to true tells Durandal to include this entry in the array of routes for the navigation bar.

## Composition

Avoid having all code in one module by following the _Single Responsibility Principle_.
A class or module should have one and only one reason to change.

For example, the navigation bar can be in a separate component from rest of application.

Durandal's _compose binding_ supports bringing together smaller pieces into the application.

One option is to compose a _partial view_, which is just an html file, with no matching javascript viewModel file.

```
data-bind="compose: 'navbar.html'"
```

Durandal will look for navbar.html in the views folder (if conventions are in use), data bind it to the parent view model, and then insert it into the DOM.

Can also compose using a view/viewModel pair:

```
data-bind="compse: 'viewmodels/navbar'"
```

Durandal will get the viewModel, matching view, bind them together, then insert the view into the DOM.

## Page Life Cycle

Orchestration of events as pages move in and out of view.

Implemented with functions in the viewModel.

### Activation Life Cycle

Controls activating and deactivating of page. Functions are

* `canDeactivate()`
* `canActivate()`
* `deactivate()`
* `activate()`

Navigating from page A to B, Durandal fires canDeactivate event on page A.

If it returns true, Durandal will fire canActivate method on the destination page B.

If that returns true, Durandal will proceed with changing the page,
calling activate on the new page, and deactivate on the old page.

Returning false from canDeactive or canActivate will stop the page transition.

You can also return a redirect object to send user to a new page. For example,
every tiem user tries to navigate to about page, they'll be redirected to catalog page:

```javascript
// viewModels/about.js
vm.canActivate = function() {
  return {redirect: '#catalog'};
};
```

#### Promises

Activate is where you would call the server to get data. If you return a Promise,
Durandal will wait until its resolved before loading the view.

By default, Durandal uses jQuery promises, but it can be customized to use other promise libraries such as Q.

The Promise object has methods to call to register functions to be executed at some point in the future.

`done()` method is called when promise resolves successfully. If something goes wrong `fail()` is called.

Can also register `always()` method to execute regardless of success or failure.

`then()` method takes success function and fail function.

`when()` takes a collection of promises, so Durandal will wait till they are _all_ resolved.

```
return $.when(promise1, promise2, promise3);
```

Every function in activation lifecycle can take a promise as a return value.
If a promise is returned, the next phase of the lifecycle will not be executed until this promise is resolved.

### Composition Life Cycle

Responsible for taking a view and viewModel, binding them together, and inserting them into the DOM.
Functions available are:

* `getView()` returns HTML for the view. This can be used to create the page dynamically in JavaScript.
* `viewUrl` parameter to specify url to an html file in the viewModel, insted of using naming convention.
* `activate()` shared by both life cycles, good place to go to server and get data, return a promise.
* `binding()` executed right before the page is data bound
* `bindingComplete()` executed when viewModel has been bound to the view
* `attached()` view has been loaded into the dom, now you can use jQuery selectors to interact with it.
* `detached()` fired when view is removed from dom
* `compositionComplete()` last one called in lifecycle. If have multiple views being composed together, complete function called after ALL the views have been composed and inserted in the dom. Here could use jQuery selectors and events to wire up events across multiple views.
