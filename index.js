
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

var path  = require('path');
var util  = require('util');
var url   = require('url');
var async = require('async');

var akasha;
var config;
var logger;

module.exports.config = function(_akasha, _config) {
	akasha = _akasha;
	config = _config;
	logger = akasha.getLogger("footnotes");
	
	config.root_partials.push(path.join(__dirname, 'partials'));
	
	return module.exports;
};

module.exports.mahabhuta = [
		function($, metadata, dirty, done) {
        	logger.trace('footnote');
        	// <footnote href="http:..." name="..." title="..." rel="nofollow">Description</footnote>
        	var footnoteCount = 0;
            var footnotes = [];
            $('footnote').each(function(i, elem) { footnotes.push(elem); });
            async.eachSeries(footnotes,
            function(footnote, next) {
            	var href = $(footnote).attr('href');
            	var name = $(footnote).attr('name');
            	var title = $(footnote).attr('title');
            	var rel   = $(footnote).attr('rel');
            	var text  = $(footnote).text();
            	akasha.partial("ak_footnoteRef.html.ejs", {
            		name: name
            	}, function(err, html) {
            		if (err) next(err);
            		else {
            		    // Ensure the footnote tags are replaced 
            		    // so we only get here the first time through
            			$(footnote).replaceWith(html);
            			
            			akasha.partial("ak_footnote.html.ejs", {
            				count: ++footnoteCount,
            				url: href,
            				title: title,
            				name: name,
            				description: text,
            				rel: rel
            			}, function(err2, html2) {
            				if (err2) next(err2);
            				else {
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
            					next();
            				}
            			});
            			
            		}
            	});
            },
            function(err) {
				if (err) {
					logger.trace('partial Errored with '+ util.inspect(err));
					done(err);
				} else done();
        	});
        }
];

		