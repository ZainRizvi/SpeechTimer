(function ($, window, undefined) {

    var pluginName = 'countdown',
        document = window.document,
        defaults = {
            height: 400,
            margeTop: 40
        };

    // Pugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.$element = null;
        this.options = $.extend({}, defaults, options);
        this._dateStart = false;
        this._dateEnd = false;
        this._duration = false;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype.init = function () {
        var self = this;

        // Find the old date, the newest date, and the time elapsed in between
        this._dateStart = new moment(this.$element.find('li:first time').attr('datetime'), 'YYYY-MM-DD');
        this._dateEnd = new moment(this.$element.find('li:last time').attr('datetime'), 'YYYY-MM-DD');
        this._duration = this._dateEnd.diff(this._dateStart);

        this.drawTimeline();
    };

    //Attach this new method to jQuery
    $.fn.extend({

        //This is where you write your plugin's name
        countdown: function () {

            //Iterate over the current set of matched elements
            return this.each(function () {

                //code to be inserted here

            });
        }
    });

    // Adding Plugin to the jQuery.fn object
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };

    //pass jQuery to the function, 
    //So that we will able to use any valid Javascript variable name 
    //to replace "$" SIGN. But, we'll stick to $ (I like dollar sign: ) )		
}(jQuery, window));
