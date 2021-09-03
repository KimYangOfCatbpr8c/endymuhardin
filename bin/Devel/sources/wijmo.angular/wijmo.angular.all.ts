/**
 * Contains AngularJS directives for the Wijmo controls.
 *
 * The directives allow you to add Wijmo controls to
 * <a href="https://angularjs.org/" target="_blank">AngularJS</a>
 * applications using simple markup in HTML pages.
 *
 * You can use directives as regular HTML tags in the page markup. The
 * tag name corresponds to the control name, prefixed with "wj-," and the
 * attributes correspond to the names of control properties and events.
 *
 * All control, property, and event names within directives follow
 * the usual AngularJS convention of replacing camel-casing with hyphenated
 * lower-case names.
 *
 * AngularJS directive parameters come in three flavors, depending on the
 * type of binding they use. The table below describes each one:
 *
 * <dl class="dl-horizontal">
 *   <dt><code>@</code></dt>   <dd>By value, or one-way binding. The attribute 
 *                             value is interpreted as a literal.</dd>
 *   <dt><code>=</code></dt>   <dd>By reference, or two-way binding. The 
 *                             attribute value is interpreted as an expression.</dd>
 *   <dt><code>&</code></dt>   <dd>Function binding. The attribute value 
 *                             is interpreted as a function call, including the parameters.</dd>
 * </dl>
 *
 * For more details on the different binding types, please see <a href=
 * "http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-2-isolate-scope"
 * target="_blank"> Dan Wahlin's blog on directives</a>.
 *  
 * The documentation does not describe directive events because they are identical to
 * the control events, and the binding mode is always the same (function binding).
 *
 * To illustrate, here is the markup used to create a @see:ComboBox control:
 *
 * <pre>&lt;wj-combo-box 
 *   text="ctx.theCountry"
 *   items-source="ctx.countries"
 *   is-editable="true"
 *   selected-index-changed="ctx.selChanged(s, e)"&gt;
 * &lt;/wj-combo-box&gt;</pre>
 *
 * Notice that the <b>text</b> property of the @see:ComboBox is bound to a controller 
 * variable called "ctx.theCountry." The binding goes two ways; changes in the control 
 * update the scope, and changes in the scope update the control. To
 * initialize the <b>text</b> property with a string constant, enclose
 * the attribute value in single quotes (for example, <code>text="'constant'"</code>).
 *
 * Notice also that the <b>selected-index-changed</b> event is bound to a controller
 * method called "selChanged," and that the binding includes the two event parameters
 * (without the parameters, the method is not called).
 * Whenever the control raises the event, the directive invokes the controller method.
 */
module wijmo.angular {

    // define the wijmo module with all dependencies
    var wijModule = window['angular'].module('wj', ['wj.input', 'wj.grid', 'wj.chart', 'wj.container', 'wj.gauge',
        'wj.olap']);
}
