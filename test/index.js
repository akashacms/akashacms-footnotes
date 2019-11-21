
const akasha   = require('akasharender');
const assert = require('chai').assert;
const booknav = require('../index');
const util = require('util');

const config = new akasha.Configuration();
config.rootURL("https://example.akashacms.com");
config.configDir = __dirname;
config.addLayoutsDir('layouts')
      .addDocumentsDir('documents');
config.use(booknav);
config.setMahabhutaConfig({
    recognizeSelfClosing: true,
    recognizeCDATA: true,
    decodeEntities: true
});
config.prepare();


describe('build site', function() {
    it('should build site', async function() {
        this.timeout(15000);
        let failed = false;
        let results = await akasha.render(config);
        for (let result of results) {
            if (result.error) {
                failed = true;
                console.error(result.error);
            }
        }
        assert.isFalse(failed);
    });
});

describe('check pages', function() {
    it('should have correct footnotes', async function() {

        let { html, $ } = await akasha.readRenderedFile(config, 
                '/page1.html');

        assert.exists(html, 'result exists');
        assert.isString(html, 'result isString');

        assert.equal($('footnote').length, 0);

        assert.equal($('div.ak-footnote').length, 5);

        assert.equal($('#footnote-area a[name=""]').length, 3);
        assert.equal($('#footnote-area a[href=""]').length, 3);

        assert.equal($('span.ak-footnote-description:contains("A footnote with no options")').length, 1);

        assert.equal($('#footnote-area a[name="with-name"]').length, 1);
        assert.include($('#footnote-area a[name="with-name"]').html(), "with-name");
        assert.equal($('span.ak-footnote-description:contains("A footnote with a name")').length, 1);

        assert.equal($('#footnote-area a[href="http://some.where"]').length, 1);
        assert.include($('#footnote-area a[href="http://some.where"]').html(), "http://some.where");
        assert.equal($('span.ak-footnote-description:contains("A footnote with an href")').length, 1);

        assert.equal($('#footnote-area a[href=""] .ak-footnote-title:contains("With Title")').length, 1);
        assert.equal($('span.ak-footnote-description:contains("A footnote with a title")').length, 1);

        assert.equal($('#footnote-area a[name="everything"]').length, 1);
        assert.include($('#footnote-area a[name="everything"]').html(), "everything");
        assert.equal($('#footnote-area a[href="http://every.thing"]').length, 1);
        assert.include($('#footnote-area a[href="http://every.thing"]').attr('rel'), "relative");
        assert.include($('#footnote-area a[href="http://every.thing"] .ak-footnote-title').html(), "With Title and all the fixings");
        assert.equal($('span.ak-footnote-description:contains("A footnote with everything and all the fixings")').length, 1);
    });


    it('should have correct footnote references', async function() {

        let { html, $ } = await akasha.readRenderedFile(config, 
                '/page1.html');

        assert.exists(html, 'result exists');
        assert.isString(html, 'result isString');

        assert.equal($('sup a[href="#with-name"]').length, 2);
        assert.equal($('sup a[href="#everything"]').length, 2);
    });
});
