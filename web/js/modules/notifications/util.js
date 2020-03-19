import util from '../../util/util';
/**
 * Categorizes the returned array
 * @function separateByType
 * @private
 * @param {object} obj - array from API
 * @returns {void}
 */
export function separateByType(array) {
  let type;
  let subObj;
  const messages = [];
  const alerts = [];
  const outages = [];

  for (let i = 0, len = array.length; i < len; i++) {
    subObj = array[i];
    type = subObj.notification_type;

    if (type === 'message') {
      messages.push(subObj);
    } else if (type === 'alert') {
      alerts.push(subObj);
    } else {
      outages.push(subObj);
    }
  }

  return {
    messages: orderByDate(messages),
    alerts: orderByDate(alerts),
    outages: orderByDate(outages),
  };
}
/**
 * Organizes array by date created
 * @function orderByDate
 * @private
 * @param {object} obj - array
 * @returns {void}
 */
function orderByDate(obj) {
  obj.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return obj;
}
/**
 * Checks to see if id or smaller #id is in localstorage
 * @function localStorageValueMatches
 * @private
 * @param {String} property - name of category type
 * @param {string} value - id of notification
 * @returns {Boolean}
 */
export function localStorageValueMatches(property, value) {
  if (!util.browser.localStorage) {
    return false;
  }
  const oldValue = localStorage.getItem(property);
  return new Date(value) <= new Date(oldValue);
}

/**
 * Sets active state global values
 * @function getPriority
 * @private
 * @param {object} sortedNotifications - object that contains categorized
 * notifications
 * @returns {void}
 */
export function getPriority(sortedNotifications) {
  let priority = '';
  const [message] = sortedNotifications.messages;
  const [outage] = sortedNotifications.outages;
  const [alert] = sortedNotifications.alerts;

  if (message && !objectAlreadySeen(message)) {
    priority = 'message';
  }

  if (alert && !objectAlreadySeen(alert)) {
    priority = 'alert';
  }

  if (outage && !objectAlreadySeen(outage)) {
    priority = 'outage';
  }

  return priority;
}
/**
 * Gets a total count of the unseen notifications
 * @function getCounts
 * @private
 * @returns {Number}
 */
export function getCount(sortedNotifications) {
  let outageCount; let messageCount; let
    alertCount;

  messageCount = getNumberOfTypeNotSeen(
    'message',
    sortedNotifications.messages,
  ); // Number of messages not yet seen
  alertCount = getNumberOfTypeNotSeen('alert', sortedNotifications.alerts); // Number of alerts not yet seen
  outageCount = getNumberOfTypeNotSeen('outage', sortedNotifications.outages); // Number of outages not yet seen

  return messageCount + outageCount + alertCount;
}
export function addToLocalStorage(obj) {
  if (!util.browser.localStorage) {
    return;
  }
  const message = obj.messages[0];
  const outage = obj.outages[0];
  const alert = obj.alerts[0];

  if (outage) {
    localStorage.setItem('outage', outage.created_at);
  }
  if (alert) {
    localStorage.setItem('alert', alert.created_at);
  }
  if (message) {
    localStorage.setItem('message', message.created_at);
  }
}
/**
 * Determines the number of status of this type that the user is yet to see
 * @function getNumberOfTypeNotSeen
 * @private
 * @param {string} type - Status type
 * @param {object} arra - array of status of one type
 * @returns {Number} count - number of unseen messages in LocalStorage
 */
export function getNumberOfTypeNotSeen(type, arra) {
  if (!util.browser.localStorage) {
    return arra.length;
  }
  const storageItem = localStorage.getItem(type);
  let count; let
    len;

  len = arra.length;
  count = 0;

  if (!storageItem) {
    return len;
  }

  for (let i = 0; i < len; i++) {
    if (new Date(storageItem) < new Date(arra[i].created_at)) {
      count++;
    } else {
      return count;
    }
  }

  return count;
}
/**
 * Determines if most recent notification has already been seen
 * @function objectAlreadySeen
 * @private
 * @param {object} obj - object from API array
 * @returns {void}
 */
function objectAlreadySeen(obj) {
  let fieldExists; let fieldValueMatches; let type; let
    idString;

  type = obj.notification_type;
  idString = obj.created_at.toString();
  fieldValueMatches = false;
  fieldExists = util.browser.localStorage && !!localStorage.getItem(type);

  if (fieldExists) {
    fieldValueMatches = localStorageValueMatches(type, idString);
  }

  return fieldValueMatches;
}
