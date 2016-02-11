
# HTML / VIEWS

#####  Once you install editor config it will set some of these defaults for you.

* Indented with 2 spaces
* Space after start of column and before close
* id before classes, then attributes, then data attrbutes, angular attributes, finally attributes with no value
* class names with dashes like `class="awesome-class"`
* id names with camelCase `id="coolAwesomeId"`
* if there are many attributes you can seperate them with a newline indented with 2 spaces with end close bracketon newline matching opening element bracket see examples.
* always use double quotes for attribute values
* NEVER EVER use `style="color: biggest-headache"` inside HTML tags
Ex:

```html

<!-- THIS IS GOOD -->
<div id="loginForm" class="form-group">
  <div class="col-xs-12 col-sm-6 col-md-6">

    <!-- this is the multiline attributes example with = aligned attributes-->
    <md-text-float
      label    = "Zipcode"
      name     = "offerZipcode"
      type     = "number"
      class    = "form-input-full"
      ng-model = "offerZipcode"
      required
    >
    </md-text-float>
    <!--
      this is the multiline comment attributes example
      WITHOUT = aligned attributes both are acceptable
    -->
    <input
      label = "Offer Name"
      name = "offerZipcode"
      type = "number"
      class = "form-input-full ng-hide"
      ng-model = "offerZipcode"
      ng-pattern = "zipcodeOnly"
      required ng-trim = "false"
    >
    <span class="error" ng-show="offerCreateForm.offerZipcode.$error.pattern">
        must be a valid zipcode
    </span>

  </div>
  <div class="col-xs-12 col-sm-6 col-md-3">

    <h4>Choose Offer</h4>
    <ui-select ng-model="offer.selected" theme="bootstrap" required>
    <!--
      {{$select.selected.Name}} is an example of correct syntax for angular in view templates
      essentially there are no spaces after opening mustache or before close mustache.
    -->
      <ui-select-match placeholder="Select Offer">{{$select.selected.Name}}</ui-select-match>
      <ui-select-choices repeat="item in offers | filter: $select.search">
        <div ng-bind-html="item.Name | highlight: $select.search"></div>
        <small ng-bind-html="item.Brand | highlight: $select.search"></small>
      </ui-select-choices>
    </ui-select>

  </div>
</div>

```