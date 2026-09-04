
/**
 *
 * Copyright 2015-2025 David Herron
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

import path from 'node:path';
// const util   = require('util');
import akasha, {
    Configuration,
    CustomElement,
    Munger,
    PageProcessor
} from 'akasharender';
const mahabhuta = akasha.mahabhuta;

const __dirname = import.meta.dirname;

const pluginName = "@akashacms/plugins-footnotes";

export class FootnotesPlugin extends akasha.Plugin {
    constructor() {
        super(pluginName);
    }

    #config;

    configure(config, options) {
        this.#config = config;
        // this.config = config;
        this.akasha = config.akasha;
        this.options = options ? options : {};
        this.options.config = config;
        config.addPartialsDir(path.join(__dirname, 'partials'));
        config.addMahabhuta(mahabhutaArray(options, config, this.akasha, this));
    }
    
    get config() { return this.#config; }
}

export function mahabhutaArray(
    options,
    config, // ?: Configuration,
    akasha, // ?: any,
    plugin  // ?: Plugin
) {
    let ret = new mahabhuta.MahafuncArray(pluginName, options);
    ret.addMahafunc(new FootnoteMunger(config, akasha, plugin));
    ret.addMahafunc(new FootnoteRef(config, akasha, plugin));
    return ret;
};

class FootnoteMunger extends Munger {
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
        let html = await this.akasha.partial(this.config, "ak_footnoteRef.html.ejs", {
            name: name
        });

        $link.replaceWith(html);

        let html2 = await this.akasha.partial(this.config, "ak_footnote.html.ejs", {
            count: ++footnoteCount,
            url: href,
            title: title,
            name: name,
            description: text,
            rel: rel
        });
        if ($('footer#footnote-area').length <= 0) {
            let marker = "<footer id='footnote-area'><strong>Footnotes</strong><br></footer>";

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
        $('footer#footnote-area').append(html2);
    }
}


class FootnoteRef extends CustomElement {
    get elementName() { return "footnote-ref"; }
    async process($element, metadata, dirty) {
        var template = $element.attr('template');
        if (!template) template = 'ak_footnoteRef.html.ejs';
        var name  = $element.attr('name');
        return await this.akasha.partial(this.config, template, {
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