
/**
 *
 * Copyright 2015 David Herron
 *
 * This file is part of AkashaCMS (http://akashacms.com/).
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

'use strict';

const path   = require('path');
const util   = require('util');
const url    = require('url');
const async  = require('async');
const akasha = require('akasharender');
const mahabhuta = akasha.mahabhuta;

const pluginName = "@akashacms/plugins-footnotes";

const _plugin_config = Symbol('config');
const _plugin_options = Symbol('options');

module.exports = class FootnotesPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    configure(config, options) {
        this[_plugin_config] = config;
        this[_plugin_options] = options;
        options.config = config;
        config.addPartialsDir(path.join(__dirname, 'partials'));
        config.addMahabhuta(module.exports.mahabhutaArray(options));
    }
    
    get config() { return this[_plugin_config]; }
    get options() { return this[_plugin_options]; }
}

module.exports.mahabhutaArray = function(options) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new FootnoteMunger());
    ret.addMahafunc(new FootnoteRef());
    return ret;
};

class FootnoteMunger extends mahabhuta.Munger {
    get selector() { return "footnote"; }
    async process($, $link, metadata, dirty) {
        // <footnote href="http:..." name="..." title="..." rel="nofollow">Description</footnote>
        var footnoteCount = 0;
        var footnotes = [];

        var href  = $link.attr('href');
        var name  = $link.attr('name');
        var title = $link.attr('title');
        var rel   = $link.attr('rel');
        var text  = $link.text();
        let html = await akasha.partial(this.array.options.config, "ak_footnoteRef.html.ejs", {
            name: name
        });

        $link.replaceWith(html);

        let html2 = await akasha.partial(this.array.options.config, "ak_footnote.html.ejs", {
            count: ++footnoteCount,
            url: href,
            title: title,
            name: name,
            description: text,
            rel: rel
        });
        if ($('div#footnote-area').length <= 0) {
            let marker = "<div id='footnote-area'><strong>Footnotes</strong><br></div>";

            // Since there isn't a designated location, find a place to insert it
            if ($('body article').length >= 1) {
                $('body article').append(marker);
            } else if ($('body').length >= 1) {
                $('body').append(marker);
            } else {
                // Insert placeholder for the footnotes.
                //
                // At the time we get here there will be
                // multiple root elements in the HTML.
                // With Cheerio 0.19 the :root selector found
                // each of those root elements.
                // We want to put this code AFTER the LAST one.
                $(":root").last().after(marker);
            }
        }
        $('div#footnote-area').append(html2);
    }
}


class FootnoteRef extends mahabhuta.CustomElement {
    get elementName() { return "footnote-ref"; }
    async process($element, metadata, dirty) {
        var template = $element.attr('template');
        if (!template) template = 'ak_footnoteRef.html.ejs';
        var name  = $element.attr('name');
        return await akasha.partial(this.array.options.config, template, {
            name: name
        });
    }
}


/*
// TODO This needs to become a Munger
module.exports.mahabhuta = [
		function($, metadata, dirty, done) {
        	log('footnote');
        	// <footnote href="http:..." name="..." title="..." rel="nofollow">Description</footnote>
        	var footnoteCount = 0;
            var footnotes = [];
            $('footnote').each(function(i, elem) { footnotes.push(elem); });
            async.eachSeries(footnotes, (footnote, next) => {
            	var href  = $(footnote).attr('href');
            	var name  = $(footnote).attr('name');
            	var title = $(footnote).attr('title');
            	var rel   = $(footnote).attr('rel');
            	var text  = $(footnote).text();
            	akasha.partial(metadata.config, "ak_footnoteRef.html.ejs", {
            		name: name
            	})
				.then(html => {
        		    // Ensure the footnote tags are replaced
        		    // so we only get here the first time through
        			$(footnote).replaceWith(html);

        			return akasha.partial(metadata.config, "ak_footnote.html.ejs", {
        				count: ++footnoteCount,
        				url: href,
        				title: title,
        				name: name,
        				description: text,
        				rel: rel
        			})
					.then(html2 => {
    					if ($('div#footnote-area').length <= 0) {
    					    // Insert placeholder for the footnotes.
    					    //
    					    // At the time we get here there will be
    					    // multiple root elements in the HTML.
    					    // With Cheerio 0.19 the :root selector found
    					    // each of those root elements.
    					    // We want to put this code AFTER the LAST one.
    						$(":root").last().after("<div id='footnote-area'><strong>Footnotes</strong><br></div>");
    					}
    					$('div#footnote-area').append(html2);
        			});
            	})
				// This executes only if there's no error being handled
				.then(() => { next(); })
				// This executes only if an error has occurred
				.catch(err => { error(err); next(err); });;
            },
            function(err) {
				if (err) {
					log('partial Errored with '+ util.inspect(err));
					done(err);
				} else done();
        	});
        }
];
*/