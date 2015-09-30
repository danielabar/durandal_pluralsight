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
  - [Composition](#composition)
  - [Page Life Cycle](#page-life-cycle)
    - [Activation Life Cycle](#activation-life-cycle)
      - [Promises](#promises)
    - [Composition Life Cycle](#composition-life-cycle)
  - [Data Binding](#data-binding)
    - [Text Binding](#text-binding)
    - [Click Binding](#click-binding)
    - [Value Binding](#value-binding)
    - [CSS Binding](#css-binding)
    - [Foreach Binding](#foreach-binding)
      - [Binding Context](#binding-context)
    - [Two-way Data Binding](#two-way-data-binding)

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

## Data Binding

Ability to bind user interface to code. i.e. binding HTML to JavaScript.
For example, bind text inside a span to a property on viewModel.
Or bind an array of objects in the view model to an unordered list of items in the view.

For data binding, the value must always be set through the view model,
so that the view gets updated when the value changes. [Example](FlashCards/app/viewmodels/catalog.js)

Durandal uses Knockout.js for data binding. Syntax makes use of HTML5 `data-` attribute.
Knockout uses `data-bind`. General syntax is:

```
data-bind="bindingName: propertyBeingBoundOnViewModel"
```

Knockout comes with many built-in data bindings, here are a few.

### Text Binding

Causes associated dom element to display text value of parameter.

```html
<h2 data=bind="text: cardTitle"></h2>
```

### Click Binding

Bind function on viewModel to click event in view. Can bind to a button, anchor tag, or even a div.

```html
data-bind="click: goToCards"
```

Knockout passes in the current binding context when function is invoked. For example

```javascript
// some viewmodel.js
vm.goToCards = function(name) {
  // do something with name
};
```

### Value Binding

Used in input, select, textarea. Represents the value of the input.
Useful in forms to bind user input to viewModel.

```html
data-bind="value: useName"
```

### CSS Binding

Add or remove css classes in html based on state of the model.
Takes an object literal that specifies css class to be applied, and boolean property to bind to.
If property is true, css class will be added to dom element, otherwise will be removed.

```html
data-bind="css: {classToAddOrRemove: booleanProperty}"
```

### Foreach Binding

Bind an array of objects to the UI. Dom elements can be repeated for each item in the array.
For example, create a list item for each name in an array of names:

```html
<ul data-bind="foreach: catalogNames">
  <li>
    <div>
      <p data-bind="text: $data"></p>
    </div>
  </li>
</ul>
```

#### Binding Context

When looping over an array, current element is represented by `$data`.

`$parent` represents viewModel object. Useful in foreach binding to bind to functions on the parent.

`$parents` array of nested viewModels. For example, could have forEach loops nested inside eachother.

`$root` all the way up to main viewModel.

### Two-way Data Binding

If the javascript is updated, the UI is updated as well. And when UI is updated, javascript will be udpated.

Knockout accomplishes this with _observables_, which keep track of the current value,
and raise events when the value changes. If you want to use two-way data bind,g _must_ use observables.

```javascript
vm.firstName = ko.observable('Mike');
vm.lasttName = ko.observable('Dudley');

vm.fulName = ko.computed(function() {
  return vm.firstName() + vm.lastName();
}, this);
```

As the viewModel gets larger, can be difficult to maintain with many observables, or having a mix of observable
and non-observable properties.

#### Observable Plugin

Allows you to have two-way data binding with plain old JS objects.
This plugin replaces properties with ES5 getters and setters, _before_ binding view and viewModel and inserting into the DOM.

To enable to plugin

```javascript
app.configurePlugins({
  // other stuff
  observable: true
});
```

Plugin works, as long as you always go through viewModel property to set the value.

```javascript
var vm = {};
vm.selectedCardDec = [];
vm.select = function(cardDeck) {
  // Going through vm object ensures value will go through getters and setters
  // added by the observable plugin
  vm.selectedCardDeck = cardDeck;
};
return vm;
```

Good practice: Create the viewModel as an object literal, attach all the properties and functions,
then return this object literal as the public interface of the module. This way, all the manipulation
of the viewModel goes through the viewModel object literal.

Note that Revealing Module Pattern does not work well with Observable Plugin. Because that module creates
private properties that can only be modified internally. However, the observable plugin adds getters and
setters to the returned object literal, that raise events when the property is changed. But if you modify
private variables, it doesn't go through the getters and setters, and data bound properties will never be updated.

## Routing

Ability to turn url string into desired view for the user. All client-side routes have hash '#' in url.
Can have complex routes containing prameters, for example: http://localhost:4000/#cards/:deckid/id/:cardid

* Enable the router plugin (main.js)
* Configure routes (shell.js in `router.map`)
* Add a router data binding (shell.html)

### Router data binding

Whatever the active view is, it will be displayed inside the router data binding.

```html
<div class="page-host" data-bind="router: { transition:'entrance' }"></div>
```

### Route Object

```javascript
{
  route: ['catalog', ''],
  title: 'Catalog',
  moduleId: 'viewmodels/catalog',
  nav: true
}
```

#### route property

The `route` property can take a string or array of strings. If it's defined as just a string, for example 'catalog',
then the corresponding url would be `http://localhost:4000/#catalog`. By convention, url is hash plus string in route.

The empty string is used to mark the default route. Can also combine an empty string and name in the route,
then both urls `http://localhost:4000` and `http://localhost:4000/#catalog` will go to same page.

#### ritle property

This is the value that will be shown in the browser navigation bar. By convention will be upper case version of route,
unless overridden in the title property.

#### moduleId property

Path to the view model.

#### nav property

If this property is true, then the route will be displayed in the navigation bar. But if set to false, will not be in navigation bar. Can still navigate there in the application.

### Route Parameters

Parameter in url is defined with a colon, for example `route: 'cards/:name'`.
In this case, `name` is a required parameter. Url would look like `http://localhost:4000/cards/Multiplication`

Route parameters are passed into the `activate` function in the viewModel, in the order they are specified in the url.

```javascript
vm.activate = function(name) {

};
```

Can also specify optional parameters by wrapping it in parenthesis. In this case, code should check if it exists before using it, for example

```javascript
vm.selectedName = '';
vm.activate = function(name) {
  vm.selectedName = name || 'Default Value';
};
```

If the route has parameters, should also state the route hash, otherwise Durandal will infer them. For exmaple:

```javascript
{ route: ['cards/:param1'], hash: '#cards', title: 'Cards', moduleId: 'viewmodels/cards', nav: false}
```

To navigate to a route programmatically, for example, from a click handler in a viewModel,
specify 'plugins/router' as a module dependency. Then use it:

```javascript
router.navigate('#cards/' + encodeURIComponent(name));
```

### Child Routers

Support second level of navigation within a page. Can also go a level deeper "grandchild".

Start with adding a special parameter in route configuration, called a "splat".

```
route: 'cards/:name*details'
```

A splat is a placeholder in the url that starts with an asterisk. This tells the main router to pass
on any additional portion of the url to a child router.

In the example below, {Id/0} is the splat, passed on to the child router.

```
http://localhost:4000/#cards/Multiplication/Id/0
```

To create a child router, use the router plugin.

```javascript
define(['plugins/router'], function(router) {
  var vm = {};

  vm.router = router.createChildRouter()
    .makeRelative({
      route: 'cards/:param1'
    })
    .map([
      {
        route: ['id(/:param2)', ''],
        moduleId: 'viewmodels/card'
      }
    ])
    .buildNavigationModel();

  return vm;
});
```

`makeRelative` tells the child router which splat parameters its supposed to handle. Takes in an object literal,
with a 'route' property. This is the first part of the route in the main router.

`map` takes an array of routes, just like the main router does. Defines what we expect to see in the splat parameters.

`buildNavigationModel` finishes the router configuration.

Also need to add a child router data binding to the html

```html
<div class="row" data-bind="router: {transition: 'entrace'}"></div>
```

Activate methods of a child router receive ALL route parameters:

```javascript
vm.activate = function(name, id) {

};
```
