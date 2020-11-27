"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var getNextId = function getNextId() {
  return Number(_lodash.default.uniqueId());
};

var buildState = function buildState(defaultState) {
  var generalChannelId = getNextId();
  var randomChannelId = getNextId();
  var state = {
    channels: [{
      id: generalChannelId,
      name: 'general',
      removable: false
    }, {
      id: randomChannelId,
      name: 'random',
      removable: false
    }],
    messages: [],
    currentChannelId: generalChannelId
  };

  if (defaultState.messages) {
    var _state$messages;

    (_state$messages = state.messages).push.apply(_state$messages, _toConsumableArray(defaultState.messages));
  }

  if (defaultState.channels) {
    var _state$channels;

    (_state$channels = state.channels).push.apply(_state$channels, _toConsumableArray(defaultState.channels));
  }

  if (defaultState.currentChannelId) {
    state.currentChannelId = defaultState.currentChannelId;
  }

  return state;
};

var _default = function _default(app, io) {
  var defaultState = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var state = buildState(defaultState);
  app.get('/', function (_req, reply) {
    reply.view('index.pug', {
      gon: state
    });
  }).get('/api/v1/channels', function (_req, reply) {
    var resources = state.channels.map(function (c) {
      return {
        type: 'channels',
        id: c.id,
        attributes: c
      };
    });
    var response = {
      data: resources
    };
    reply.send(response);
  }).post('/api/v1/channels', function (req, reply) {
    var name = req.body.data.attributes.name;
    var channel = {
      name: name,
      removable: true,
      id: getNextId()
    };
    state.channels.push(channel);
    reply.code(201);
    var data = {
      data: {
        type: 'channels',
        id: channel.id,
        attributes: channel
      }
    };
    reply.send(data);
    io.emit('newChannel', data);
  }).delete('/api/v1/channels/:id', function (req, reply) {
    var channelId = Number(req.params.id);
    state.channels = state.channels.filter(function (c) {
      return c.id !== channelId;
    });
    state.messages = state.messages.filter(function (m) {
      return m.channelId !== channelId;
    });
    reply.code(204);
    var data = {
      data: {
        type: 'channels',
        id: channelId
      }
    };
    reply.send(data);
    io.emit('removeChannel', data);
  }).patch('/api/v1/channels/:id', function (req, reply) {
    var channelId = Number(req.params.id);
    var channel = state.channels.find(function (c) {
      return c.id === channelId;
    });
    var attributes = req.body.data.attributes;
    channel.name = attributes.name;
    var data = {
      data: {
        type: 'channels',
        id: channelId,
        attributes: channel
      }
    };
    reply.send(data);
    io.emit('renameChannel', data);
  }).get('/api/v1/channels/:channelId/messages', function (req, reply) {
    var messages = state.messages.filter(function (m) {
      return m.channelId === Number(req.params.channelId);
    });
    var resources = messages.map(function (m) {
      return {
        type: 'messages',
        id: m.id,
        attributes: m
      };
    });
    var response = {
      data: resources
    };
    reply.send(response);
  }).post('/api/v1/channels/:channelId/messages', function (req, reply) {
    var attributes = req.body.data.attributes;

    var message = _objectSpread(_objectSpread({}, attributes), {}, {
      channelId: Number(req.params.channelId),
      id: getNextId()
    });

    state.messages.push(message);
    reply.code(201);
    var data = {
      data: {
        type: 'messages',
        id: message.id,
        attributes: message
      }
    };
    reply.send(data);
    io.emit('newMessage', data);
  });
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9yb3V0ZXMuanMiXSwibmFtZXMiOlsiZ2V0TmV4dElkIiwiTnVtYmVyIiwiXyIsInVuaXF1ZUlkIiwiYnVpbGRTdGF0ZSIsImRlZmF1bHRTdGF0ZSIsImdlbmVyYWxDaGFubmVsSWQiLCJyYW5kb21DaGFubmVsSWQiLCJzdGF0ZSIsImNoYW5uZWxzIiwiaWQiLCJuYW1lIiwicmVtb3ZhYmxlIiwibWVzc2FnZXMiLCJjdXJyZW50Q2hhbm5lbElkIiwicHVzaCIsImFwcCIsImlvIiwiZ2V0IiwiX3JlcSIsInJlcGx5IiwidmlldyIsImdvbiIsInJlc291cmNlcyIsIm1hcCIsImMiLCJ0eXBlIiwiYXR0cmlidXRlcyIsInJlc3BvbnNlIiwiZGF0YSIsInNlbmQiLCJwb3N0IiwicmVxIiwiYm9keSIsImNoYW5uZWwiLCJjb2RlIiwiZW1pdCIsImRlbGV0ZSIsImNoYW5uZWxJZCIsInBhcmFtcyIsImZpbHRlciIsIm0iLCJwYXRjaCIsImZpbmQiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWTtBQUFBLFNBQU1DLE1BQU0sQ0FBQ0MsZ0JBQUVDLFFBQUYsRUFBRCxDQUFaO0FBQUEsQ0FBbEI7O0FBRUEsSUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsWUFBRCxFQUFrQjtBQUNuQyxNQUFNQyxnQkFBZ0IsR0FBR04sU0FBUyxFQUFsQztBQUNBLE1BQU1PLGVBQWUsR0FBR1AsU0FBUyxFQUFqQztBQUNBLE1BQU1RLEtBQUssR0FBRztBQUNaQyxJQUFBQSxRQUFRLEVBQUUsQ0FDUjtBQUFFQyxNQUFBQSxFQUFFLEVBQUVKLGdCQUFOO0FBQXdCSyxNQUFBQSxJQUFJLEVBQUUsU0FBOUI7QUFBeUNDLE1BQUFBLFNBQVMsRUFBRTtBQUFwRCxLQURRLEVBRVI7QUFBRUYsTUFBQUEsRUFBRSxFQUFFSCxlQUFOO0FBQXVCSSxNQUFBQSxJ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SUFEb0QsQ0FDNUNGLFVBRDRDOztBQUU1RCxRQUFNaUIsT0FBTyxtQ0FDUmpCLFVBRFE7QUFFWFcsTUFBQUEsU0FBUyxFQUFFckMsTUFBTSxDQUFDK0IsR0FBRyxDQUFDTyxNQUFKLENBQVdELFNBQVosQ0FGTjtBQUdYNUIsTUFBQUEsRUFBRSxFQUFFVixTQUFTO0FBSEYsTUFBYjs7QUFLQVEsSUFBQUEsS0FBSyxDQUFDSyxRQUFOLENBQWVFLElBQWYsQ0FBb0I2QixPQUFwQjtBQUNBeEIsSUFBQUEsS0FBSyxDQUFDZSxJQUFOLENBQVcsR0FBWDtBQUNBLFFBQU1OLElBQUksR0FBRztBQUNYQSxNQUFBQSxJQUFJLEVBQUU7QUFDSkgsUUFBQUEsSUFBSSxFQUFFLFVBREY7QUFFSmhCLFFBQUFBLEVBQUUsRUFBRWtDLE9BQU8sQ0FBQ2xDLEVBRlI7QUFHSmlCLFFBQUFBLFVBQVUsRUFBRWlCO0FBSFI7QUFESyxLQUFiO0FBT0F4QixJQUFBQSxLQUFLLENBQUNVLElBQU4sQ0FBV0QsSUFBWDtBQUNBWixJQUFBQSxFQUFFLENBQUNtQixJQUFILENBQVEsWUFBUixFQUFzQlAsSUFBdEI7QUFDRCxHQWpHSDtBQWtHRCxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5cbmNvbnN0IGdldE5leHRJZCA9ICgpID0+IE51bWJlcihfLnVuaXF1ZUlkKCkpO1xuXG5jb25zdCBidWlsZFN0YXRlID0gKGRlZmF1bHRTdGF0ZSkgPT4ge1xuICBjb25zdCBnZW5lcmFsQ2hhbm5lbElkID0gZ2V0TmV4dElkKCk7XG4gIGNvbnN0IHJhbmRvbUNoYW5uZWxJZCA9IGdldE5leHRJZCgpO1xuICBjb25zdCBzdGF0ZSA9IHtcbiAgICBjaGFubmVsczogW1xuICAgICAgeyBpZDogZ2VuZXJhbENoYW5uZWxJZCwgbmFtZTogJ2dlbmVyYWwnLCByZW1vdmFibGU6IGZhbHNlIH0sXG4gICAgICB7IGlkOiByYW5kb21DaGFubmVsSWQsIG5hbWU6ICdyYW5kb20nLCByZW1vdmFibGU6IGZhbHNlIH0sXG4gICAgXSxcbiAgICBtZXNzYWdlczogW10sXG4gICAgY3VycmVudENoYW5uZWxJZDogZ2VuZXJhbENoYW5uZWxJZCxcbiAgfTtcblxuICBpZiAoZGVmYXVsdFN0YXRlLm1lc3NhZ2VzKSB7XG4gICAgc3RhdGUubWVzc2FnZXMucHVzaCguLi5kZWZhdWx0U3RhdGUubWVzc2FnZXMpO1xuICB9XG4gIGlmIChkZWZhdWx0U3RhdGUuY2hhbm5lbHMpIHtcbiAgICBzdGF0ZS5jaGFubmVscy5wdXNoKC4uLmRlZmF1bHRTdGF0ZS5jaGFubmVscyk7XG4gIH1cbiAgaWYgKGRlZmF1bHRTdGF0ZS5jdXJyZW50Q2hhbm5lbElkKSB7XG4gICAgc3RhdGUuY3VycmVudENoYW5uZWxJZCA9IGRlZmF1bHRTdGF0ZS5jdXJyZW50Q2hhbm5lbElkO1xuICB9XG5cbiAgcmV0dXJuIHN0YXRlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgKGFwcCwgaW8sIGRlZmF1bHRTdGF0ZSA9IHt9KSA9PiB7XG4gIGNvbnN0IHN0YXRlID0gYnVpbGRTdGF0ZShkZWZhdWx0U3RhdGUpO1xuXG4gIGFwcFxuICAgIC5nZXQoJy8nLCAoX3JlcSwgcmVwbHkpID0+IHtcbiAgICAgIHJlcGx5LnZpZXcoJ2luZGV4LnB1ZycsIHsgZ29uOiBzdGF0ZSB9KTtcbiAgICB9KVxuICAgIC5nZXQoJy9hcGkvdjEvY2hhbm5lbHMnLCAoX3JlcSwgcmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IHJlc291cmNlcyA9IHN0YXRlLmNoYW5uZWxzLm1hcCgoYykgPT4gKHtcbiAgICAgICAgdHlwZTogJ2NoYW5uZWxzJyxcbiAgICAgICAgaWQ6IGMuaWQsXG4gICAgICAgIGF0dHJpYnV0ZXM6IGMsXG4gICAgICB9KSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzb3VyY2VzLFxuICAgICAgfTtcbiAgICAgIHJlcGx5LnNlbmQocmVzcG9uc2UpO1xuICAgIH0pXG4gICAgLnBvc3QoJy9hcGkvdjEvY2hhbm5lbHMnLCAocmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc3QgeyBkYXRhOiB7IGF0dHJpYnV0ZXM6IHsgbmFtZSB9IH0gfSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3QgY2hhbm5lbCA9IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgcmVtb3ZhYmxlOiB0cnVlLFxuICAgICAgICBpZDogZ2V0TmV4dElkKCksXG4gICAgICB9O1xuICAgICAgc3RhdGUuY2hhbm5lbHMucHVzaChjaGFubmVsKTtcbiAgICAgIHJlcGx5LmNvZGUoMjAxKTtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAnY2hhbm5lbHMnLFxuICAgICAgICAgIGlkOiBjaGFubmVsLmlkLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IGNoYW5uZWwsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICByZXBseS5zZW5kKGRhdGEpO1xuICAgICAgaW8uZW1pdCgnbmV3Q2hhbm5lbCcsIGRhdGEpO1xuICAgIH0pXG4gICAgLmRlbGV0ZSgnL2FwaS92MS9jaGFubmVscy86aWQnLCAocmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc3QgY2hhbm5lbElkID0gTnVtYmVyKHJlcS5wYXJhbXMuaWQpO1xuICAgICAgc3RhdGUuY2hhbm5lbHMgPSBzdGF0ZS5jaGFubmVscy5maWx0ZXIoKGMpID0+IGMuaWQgIT09IGNoYW5uZWxJZCk7XG4gICAgICBzdGF0ZS5tZXNzYWdlcyA9IHN0YXRlLm1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS5jaGFubmVsSWQgIT09IGNoYW5uZWxJZCk7XG4gICAgICByZXBseS5jb2RlKDIwNCk7XG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ2NoYW5uZWxzJyxcbiAgICAgICAgICBpZDogY2hhbm5lbElkLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgcmVwbHkuc2VuZChkYXRhKTtcbiAgICAgIGlvLmVtaXQoJ3JlbW92ZUNoYW5uZWwnLCBkYXRhKTtcbiAgICB9KVxuICAgIC5wYXRjaCgnL2FwaS92MS9jaGFubmVscy86aWQnLCAocmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc3QgY2hhbm5lbElkID0gTnVtYmVyKHJlcS5wYXJhbXMuaWQpO1xuICAgICAgY29uc3QgY2hhbm5lbCA9IHN0YXRlLmNoYW5uZWxzLmZpbmQoKGMpID0+IGMuaWQgPT09IGNoYW5uZWxJZCk7XG5cbiAgICAgIGNvbnN0IHsgZGF0YTogeyBhdHRyaWJ1dGVzIH0gfSA9IHJlcS5ib2R5O1xuICAgICAgY2hhbm5lbC5uYW1lID0gYXR0cmlidXRlcy5uYW1lO1xuXG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ2NoYW5uZWxzJyxcbiAgICAgICAgICBpZDogY2hhbm5lbElkLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IGNoYW5uZWwsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmVwbHkuc2VuZChkYXRhKTtcbiAgICAgIGlvLmVtaXQoJ3JlbmFtZUNoYW5uZWwnLCBkYXRhKTtcbiAgICB9KVxuICAgIC5nZXQoJy9hcGkvdjEvY2hhbm5lbHMvOmNoYW5uZWxJZC9tZXNzYWdlcycsIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlcyA9IHN0YXRlLm1lc3NhZ2VzLmZpbHRlcigobSkgPT4gbS5jaGFubmVsSWQgPT09IE51bWJlcihyZXEucGFyYW1zLmNoYW5uZWxJZCkpO1xuICAgICAgY29uc3QgcmVzb3VyY2VzID0gbWVzc2FnZXMubWFwKChtKSA9PiAoe1xuICAgICAgICB0eXBlOiAnbWVzc2FnZXMnLFxuICAgICAgICBpZDogbS5pZCxcbiAgICAgICAgYXR0cmlidXRlczogbSxcbiAgICAgIH0pKTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0ge1xuICAgICAgICBkYXRhOiByZXNvdXJjZXMsXG4gICAgICB9O1xuICAgICAgcmVwbHkuc2VuZChyZXNwb25zZSk7XG4gICAgfSlcbiAgICAucG9zdCgnL2FwaS92MS9jaGFubmVscy86Y2hhbm5lbElkL21lc3NhZ2VzJywgKHJlcSwgcmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IHsgZGF0YTogeyBhdHRyaWJ1dGVzIH0gfSA9IHJlcS5ib2R5O1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgICAgLi4uYXR0cmlidXRlcyxcbiAgICAgICAgY2hhbm5lbElkOiBOdW1iZXIocmVxLnBhcmFtcy5jaGFubmVsSWQpLFxuICAgICAgICBpZDogZ2V0TmV4dElkKCksXG4gICAgICB9O1xuICAgICAgc3RhdGUubWVzc2FnZXMucHVzaChtZXNzYWdlKTtcbiAgICAgIHJlcGx5LmNvZGUoMjAxKTtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICB0eXBlOiAnbWVzc2FnZXMnLFxuICAgICAgICAgIGlkOiBtZXNzYWdlLmlkLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IG1lc3NhZ2UsXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgcmVwbHkuc2VuZChkYXRhKTtcbiAgICAgIGlvLmVtaXQoJ25ld01lc3NhZ2UnLCBkYXRhKTtcbiAgICB9KTtcbn07XG4iXX0=