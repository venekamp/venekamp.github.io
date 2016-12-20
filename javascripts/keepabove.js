(function($) {
    $.keepAboveElement = function(el, options) {
        this.$el = $(el);
        this.el = el;

        var element = this.$el;

        var elementHeight = element.outerHeight(true);
        var tripPoint = options.tripPoint;

        console.log("tripPoint = " + tripPoint + "  elementHeight = " + elementHeight);

        function setValues() {
            elementHeight = element.height();
            console.log("elementHeight = " + elementHeight);
        };

        function checkTripValue2() {
            elementHeight = element.outerHeight(true);
            checkTripValue();
        }

        function checkTripValue() {
            var currentOffset = window.pageYOffset + window.innerHeight;

            console.log("tripPoint = " + tripPoint + "  elementHeight = " + elementHeight);

            if (currentOffset < tripPoint) {
                setToFixedOnceOnly(0);
            } else {
                setToAbsoluteOnceOnly(tripPoint - elementHeight);
            }
        };

        function setToFixedOnceOnly(offset) {
            if (element.css("position") != "fixed") {
                setToFixed(0);
            }
        };

        function setToFixed(offset) {
            var cssOptions = {
                "position": "fixed",
                "top": "",
                "bottom": "0",
                //"height": elementHeight + "px"
            }

            element.css(cssOptions);
            console.log("SetToFixed:\n" + JSON.stringify(cssOptions, null, 4));
        };

        function setToAbsoluteOnceOnly(offset) {
            if (element.css("position") != "absolute") {
                setToAbsolute(offset);
            }
        };

        function setToAbsolute(offset) {
            var cssOptions = {
                "position": "absolute",
                "top": offset + "px",
                "bottom": "",
                //"height": elementHeight + "px"
            };

            element.css(cssOptions);
            console.log("SetToAbsolute:\n" + JSON.stringify(cssOptions, null, 4));
        };

        this.init = function() {
            $(document).ready(function() { checkTripValue2(); });
            //$(window).on("load", checkTripValue2);

            $(window).on("scroll", checkTripValue);

            // TODO: Resizeing the window should also recaulate the tripPoint.
            $(window).on("resize", checkTripValue);
        };

        this.init();
    };

    $.fn.keepAboveElement = function(options) {
        return this.each(function() {
            (new $.keepAboveElement(this, options));
        });
    };

})(jQuery);
