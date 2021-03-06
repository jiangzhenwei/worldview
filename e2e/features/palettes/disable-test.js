const normalizeViewport = require('../../reuseables/normalize-viewport.js').normalizeViewport;
const TIME_LIMIT = 10000;
const enabledPermalink = '?l=Last_of_the_Wild_1995-2004';
const disabledPermalink = '?l=Last_of_the_Wild_1995-2004(disabled=0-13-12-1-2-6)';
const classColorBoxId = '#Last_of_the_Wild_1995-2004_0_legend-color-active';
module.exports = {
  before: function(client) {
    normalizeViewport(client, 1000, 850);
    client.url(client.globals.url + enabledPermalink);
  },
  'Verify that toggling class updates permalink and layer-legend': function(client) {
    client.waitForElementVisible('#active-Last_of_the_Wild_1995-2004', TIME_LIMIT, function() {
      client.expect.element('#active-Last_of_the_Wild_1995-2004 .disabled-classification').to.not.be.present;
      client.click('#active-Last_of_the_Wild_1995-2004 .wv-layers-options');
      client.waitForElementVisible('.layer-classification-toggle', 2000, function() {
        client.click('.react-switch-case .react-switch-button');
        client.waitForElementVisible(classColorBoxId + '0.disabled-classification', TIME_LIMIT, () => {
          client.expect.element(classColorBoxId + '1.disabled-classification').to.not.be.present;
          client.assert.urlContains('(disabled=0)');
        });
      });
    });
  },
  'Verify that loaded permalink disables classes': function(client) {
    client.url(client.globals.url + disabledPermalink);
    client.waitForElementVisible(classColorBoxId + '0', TIME_LIMIT, function() {
      client.expect.element(classColorBoxId + '0.disabled-classification').to.be.present;
      client.expect.element(classColorBoxId + '13.disabled-classification').to.be.present;
      client.expect.element(classColorBoxId + '6.disabled-classification').to.be.present;
      client.expect.element(classColorBoxId + '5.disabled-classification').to.not.be.present;
      client.expect.element(classColorBoxId + '11.disabled-classification').to.not.be.present;
      client.expect.element(classColorBoxId + '3.disabled-classification').to.not.be.present;
    });
  },
  after: function(client) {
    client.end();
  }
};
