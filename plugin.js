(function() {
    'use strict';

    /**
 * @module CommentsPlugin
 */
function CommentsPlugin(configuration, logger) {
    this.configuration = configuration;
    this.logger = logger;
}

// get visualization group of element
CommentsPlugin.prototype.getVisualizationGroup =  function(element) {
    if (element.hasAttribute('data-mode')) {
        var dataModes = element.getAttribute('data-mode').split(' ');
        if (dataModes.indexOf('user-posts') >= 0) {
            return 'user';
        }
    }
    // default visualization group
    return 'product';
};

// add parameter for url
CommentsPlugin.prototype.addParameterToUrl = function(url, parameter) {
    // check if last character is '&' and if not, set that character
    url += url.charAt(url.length - 1) == '?' ? '' : '&';
    url +=  parameter;
    return url;
};

// find elements by configured query
CommentsPlugin.prototype.getMarkedElements = function() {
    return document.querySelectorAll(this.configuration.elementsQuery);
};

// insert content in marked elements
CommentsPlugin.prototype.insertContentInMarkedElements = function() {
    var elements = this.getMarkedElements(),
        index,
        i,
        element,
        requiredAttribute,
        visualizationGroup,
        requiredAttributes,
        hasRequiredAttributes;

    for (i = 0; i < elements.length; i++) {
        hasRequiredAttributes = true;
        element = elements[i];
        visualizationGroup = this.getVisualizationGroup(element);
        requiredAttributes = this.configuration.visualizationGroups[visualizationGroup].requiredAttributes;
        // set default height to 0px to don't taking up space if iframe doesn't load
        element.style.height = '0px';
        // check if element has required attributes
		
		for(var index = 0; index < requiredAttributes.length; index += 1) {
			requiredAttribute = requiredAttributes[index];
			console.log(requiredAttribute);
			if (!element.hasAttribute(requiredAttribute)) {
                hasRequiredAttributes = false;
                logger.log('Attribute ' + requiredAttribute + ' is required', 'warn', element);
            }
        }
		
        if (hasRequiredAttributes) {
            this.insertIframe(elements[i], i);
        }
    }
};

// insert iframe in specific element
CommentsPlugin.prototype.insertIframe = function(element, index) {
    var iframeConfiguration = this.getIframeConfiguration(element, index);
    // ifrmae element
    var iframeElement = document.createElement('iframe');
    // iframe attributes
    iframeElement.setAttribute('src', iframeConfiguration.url);
    iframeElement.setAttribute('width',  iframeConfiguration.width);
    iframeElement.setAttribute('scrolling', 'no');
    iframeElement.setAttribute('frameborder', '0');
    // unique id
    iframeElement.setAttribute('id', this.configuration.iframeIdPrefix + index);
    iframeElement.style.height = "100%";
    // insert iframe in element
    element.appendChild(iframeElement);
};

// get configuration to create iframe for element
CommentsPlugin.prototype.getIframeConfiguration = function(element, index) {
    var iframeConfiguration,
        attribute,
        visualizationGroupName = this.getVisualizationGroup(element),
        attributes = element.attributes,
        visualizationGroup = this.configuration.visualizationGroups[visualizationGroupName],
        acceptedAttributes = visualizationGroup.acceptedAttributes,
        param,

    // base configuration
    iframeConfiguration = {
        url: configuration.baseIframeUrl +
            '?language=' + this.configuration.language +
            '&iframeIndex=' + index +
            '&group=' + visualizationGroupName,
        width: this.configuration.defaultWidth
    };

    if (!element.hasAttribute('data-productid')) {
        param = encodeURIComponent(location.href.replace(location.protocol + '//', ''));
		iframeConfiguration.url += '&url=' + param;
    }

    for (var i = 0; i < attributes.length; i++) {
        attribute = attributes[i];
        if (acceptedAttributes.indexOf(attribute.name) < 0) {
            continue;
        }
        param = null;
        switch (attribute.name) {
            case 'data-mode':
                var modes = attribute.value.split(' ');
                modes.forEach(function(mode) {
                    // validate passed modes
                    if (visualizationGroup.visualizationModes.indexOf(mode) >=0) {
                        iframeConfiguration.url = this.addParameterToUrl(iframeConfiguration.url, 'modes=' + mode);
                    }
                }, this);
                break;
            case 'data-comment':
                var isNumberAndHasTrueValue = (!isNaN(parseInt(attribute.value)) && !!parseInt(attribute.value));
                if (attribute.value == "" || attribute.value == 'data-comment' || isNumberAndHasTrueValue) {
                    param = 'comment=true';
                }
                break;
            case 'data-productid':
                param = 'productId=' + attribute.value;
                break;
            case 'data-color':
                // encode URI for sharp values
                param = 'color=' + encodeURIComponent(attribute.value);
                break;
            case 'data-width':
                var width = parseInt(attribute.value);
                // check if is a value integer
                if (!isNaN(width)) {
                    iframeConfiguration.width = width;
                }
                break;
            case 'data-num-comments':
                param = 'numComments=' + attribute.value;
                break;
            case 'data-email':
                param = 'email=' + attribute.value;
                break;
            case 'data-show-profile-face':
                var isNumberAndHasTrueValue = (!isNaN(parseInt(attribute.value)) && !!parseInt(attribute.value));
                if (attribute.value == "" || attribute.value == 'data-show-profile-face' || isNumberAndHasTrueValue) {
                    param = 'showProfileFace=true';
                }
                break;
            case 'data-font-color':
                // encode URI for sharp values
                param = 'fontColor=' + encodeURIComponent(attribute.value);
                break;
        }
        // add passed param to URL
        if (param) {
            iframeConfiguration.url = this.addParameterToUrl(iframeConfiguration.url, param);
        }
    }

    return iframeConfiguration;
}


    /**
 * @module commentsPlugin
 */
function Logger(prefix) {
    this.prefix = prefix;
}

/**
 * @method log
 * @param {Object} message
 * @param {String} type
 */
Logger.prototype.log = function(message, type) {
    type = console[type] !== undefined ? type : 'log';
    console[type](configuration.logPrefix, message);
};


    /**
     * Plugin configuration
     */
    var configuration = {};
    configuration.defaultLanguage = 'pt'
    configuration.language = (function() {
        try {
            var script = document.querySelector('script[data-name=bl-script]');
            return script.getAttribute('data-language');
        } catch (error) {
            return configuration.defaultLanguage;
        }
    })();
    // works on file protocol
    configuration.baseUrl = ('https:' == document.location.protocol ? 'https:' : 'http:') + '//brandlovers.com';
    configuration.baseIframeUrl = configuration.baseUrl + '/api/plugin/comments';
    configuration.elementsQuery = '.bl-comment';
    configuration.iframeIdPrefix = 'bl-iframe-comments-';
    configuration.defaultWidth = '100%';
    configuration.logPrefix = '[BL-COMMENT] :: ';
    configuration.visualizationGroups = {
        'product': {
            'acceptedAttributes': [
                'data-mode',
                'data-comment',
                'data-productid',
                'data-color',
                'data-width',
                'data-num-comments',
                'data-show-profile-face',
                'data-font-color'
            ],
            'requiredAttributes': ['data-mode'],
            'visualizationModes': ['action-shot', 'reviews', 'wheretobuy']
        },
        'user': {
            'acceptedAttributes': [
                'data-mode',
                'data-email',
                'data-color',
                'data-font-color'
            ],
            'requiredAttributes': ['data-mode', 'data-email'],
            'visualizationModes': ['user-posts']
        }
    };

    var logger = new Logger();
    var commentsPlugin = new CommentsPlugin(configuration, logger);

    // listen for messages to update iframe height
    window.addEventListener('message', function(event) {
        // check if message is from configured domain
        if (event.origin !== configuration.baseUrl) {
            return;
        }

        // change height of element with passed index
        var element = document.getElementById(configuration.iframeIdPrefix + event.data.iframeIndex);
        element.parentElement.style.height = event.data.height;
    });

    window.addEventListener('load', function() {
        // call main function
        commentsPlugin.insertContentInMarkedElements();
    });
})();
