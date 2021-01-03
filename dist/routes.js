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
  var rollbarToken = '19e9fde8edfb41e885aedadb0aefdeb4';
  app.get('/', function (_req, reply) {
    reply.view('index.pug', {
      gon: _objectSpread(_objectSpread({}, state), {}, {
        rollbarToken: rollbarToken
      })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NlcnZlci9yb3V0ZXMuanMiXSwibmFtZXMiOlsiZ2V0TmV4dElkIiwiTnVtYmVyIiwiXyIsInVuaXF1ZUlkIiwiYnVpbGRTdGF0ZSIsImRlZmF1bHRTdGF0ZSIsImdlbmVyYWxDaGFubmVsSWQiLCJyYW5kb21DaGFubmVsSWQiLCJzdGF0ZSIsImNoYW5uZWxzIiwiaWQiLCJuYW1lIiwicmVtb3ZhYmxlIiwibWVzc2FnZXMiLCJjdXJyZW50Q2hhbm5lbElkIiwicHVzaCIsImFwcCIsImlvIiwicm9sbGJhclRva2VuIiwiZ2V0IiwiX3JlcSIsInJlcGx5IiwidmlldyIsImdvbiIsInJlc291cmNlcyIsIm1hcCIsImMiLCJ0eXBlIiwiYXR0cmlidXRlcyIsInJlc3BvbnNlIiwiZGF0YSIsInNlbmQiLCJwb3N0IiwicmVxIiwiYm9keSIsImNoYW5uZWwiLCJjb2RlIiwiZW1pdCIsImRlbGV0ZSIsImNoYW5uZWxJZCIsInBhcmFtcyIsImZpbHRlciIsIm0iLCJwYXRjaCIsImZpbmQiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxTQUFTLEdBQUcsU0FBWkEsU0FBWTtBQUFBLFNBQU1DLE1BQU0sQ0FBQ0MsZ0JBQUVDLFFBQUYsRUFBRCxDQUFaO0FBQUEsQ0FBbEI7O0FBRUEsSUFBTUMsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBQ0MsWUFBRCxFQUFrQjtBQUNuQyxNQUFNQyxnQkFBZ0IsR0FBR04sU0FBUyxFQUFsQztBQUNBLE1BQU1PLGVBQWUsR0FBR1AsU0FBUyxFQUFqQztBQUNBLE1BQU1RLEtBQUssR0FBRztBQUNaQyxJQUFBQSxRQUFRLEVBQUUsQ0FDUjtBQUFFQyxNQUFBQSxFQUFFLEVBQUVKLGdCQUFOO0FBQXdCSyxNQUFBQSxJQUFJLEVBQUUsU0FBOUI7QUFBeUNDLE1BQUFBLFNBQVMsRUFBRTtBQUFwRCxLQURRLEVBRVI7QUFBRUYsTUFBQUEsRUFBRSxFQUFFSCxlQUFO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QStFZ0QsVUFBQ0MsR0FBRCxFQUFNWixLQUFOLEVBQWdCO0FBQUEsUUFDNUNPLFVBRDRDLEdBQzNCSyxHQUFHLENBQUNDLElBRHVCLENBQ3BESixJQURvRCxDQUM1Q0YsVUFENEM7O0FBRTVELFFBQU1pQixPQUFPLG1DQUNSakIsVUFEUTtBQUVYVyxNQUFBQSxTQUFTLEVBQUV0QyxNQUFNLENBQUNnQyxHQUFHLENBQUNPLE1BQUosQ0FBV0QsU0FBWixDQUZOO0FBR1g3QixNQUFBQSxFQUFFLEVBQUVWLFNBQVM7QUFIRixNQUFiOztBQUtBUSxJQUFBQSxLQUFLLENBQUNLLFFBQU4sQ0FBZUUsSUFBZixDQUFvQjhCLE9BQXBCO0FBQ0F4QixJQUFBQSxLQUFLLENBQUNlLElBQU4sQ0FBVyxHQUFYO0FBQ0EsUUFBTU4sSUFBSSxHQUFHO0FBQ1hBLE1BQUFBLElBQUksRUFBRTtBQUNKSCxRQUFBQSxJQUFJLEVBQUUsVUFERjtBQUVKakIsUUFBQUEsRUFBRSxFQUFFbUMsT0FBTyxDQUFDbkMsRUFGUjtBQUdKa0IsUUFBQUEsVUFBVSxFQUFFaUI7QUFIUjtBQURLLEtBQWI7QUFPQXhCLElBQUFBLEtBQUssQ0FBQ1UsSUFBTixDQUFXRCxJQUFYO0FBQ0FiLElBQUFBLEVBQUUsQ0FBQ29CLElBQUgsQ0FBUSxZQUFSLEVBQXNCUCxJQUF0QjtBQUNELEdBakdIO0FBa0dELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5jb25zdCBnZXROZXh0SWQgPSAoKSA9PiBOdW1iZXIoXy51bmlxdWVJZCgpKTtcblxuY29uc3QgYnVpbGRTdGF0ZSA9IChkZWZhdWx0U3RhdGUpID0+IHtcbiAgY29uc3QgZ2VuZXJhbENoYW5uZWxJZCA9IGdldE5leHRJZCgpO1xuICBjb25zdCByYW5kb21DaGFubmVsSWQgPSBnZXROZXh0SWQoKTtcbiAgY29uc3Qgc3RhdGUgPSB7XG4gICAgY2hhbm5lbHM6IFtcbiAgICAgIHsgaWQ6IGdlbmVyYWxDaGFubmVsSWQsIG5hbWU6ICdnZW5lcmFsJywgcmVtb3ZhYmxlOiBmYWxzZSB9LFxuICAgICAgeyBpZDogcmFuZG9tQ2hhbm5lbElkLCBuYW1lOiAncmFuZG9tJywgcmVtb3ZhYmxlOiBmYWxzZSB9LFxuICAgIF0sXG4gICAgbWVzc2FnZXM6IFtdLFxuICAgIGN1cnJlbnRDaGFubmVsSWQ6IGdlbmVyYWxDaGFubmVsSWQsXG4gIH07XG5cbiAgaWYgKGRlZmF1bHRTdGF0ZS5tZXNzYWdlcykge1xuICAgIHN0YXRlLm1lc3NhZ2VzLnB1c2goLi4uZGVmYXVsdFN0YXRlLm1lc3NhZ2VzKTtcbiAgfVxuICBpZiAoZGVmYXVsdFN0YXRlLmNoYW5uZWxzKSB7XG4gICAgc3RhdGUuY2hhbm5lbHMucHVzaCguLi5kZWZhdWx0U3RhdGUuY2hhbm5lbHMpO1xuICB9XG4gIGlmIChkZWZhdWx0U3RhdGUuY3VycmVudENoYW5uZWxJZCkge1xuICAgIHN0YXRlLmN1cnJlbnRDaGFubmVsSWQgPSBkZWZhdWx0U3RhdGUuY3VycmVudENoYW5uZWxJZDtcbiAgfVxuXG4gIHJldHVybiBzdGF0ZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IChhcHAsIGlvLCBkZWZhdWx0U3RhdGUgPSB7fSkgPT4ge1xuICBjb25zdCBzdGF0ZSA9IGJ1aWxkU3RhdGUoZGVmYXVsdFN0YXRlKTtcbiAgY29uc3Qgcm9sbGJhclRva2VuID0gJzE5ZTlmZGU4ZWRmYjQxZTg4NWFlZGFkYjBhZWZkZWI0JztcblxuICBhcHBcbiAgICAuZ2V0KCcvJywgKF9yZXEsIHJlcGx5KSA9PiB7XG4gICAgICByZXBseS52aWV3KCdpbmRleC5wdWcnLCB7IGdvbjogeyAuLi5zdGF0ZSwgcm9sbGJhclRva2VuIH0gfSk7XG4gICAgfSlcbiAgICAuZ2V0KCcvYXBpL3YxL2NoYW5uZWxzJywgKF9yZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCByZXNvdXJjZXMgPSBzdGF0ZS5jaGFubmVscy5tYXAoKGMpID0+ICh7XG4gICAgICAgIHR5cGU6ICdjaGFubmVscycsXG4gICAgICAgIGlkOiBjLmlkLFxuICAgICAgICBhdHRyaWJ1dGVzOiBjLFxuICAgICAgfSkpO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XG4gICAgICAgIGRhdGE6IHJlc291cmNlcyxcbiAgICAgIH07XG4gICAgICByZXBseS5zZW5kKHJlc3BvbnNlKTtcbiAgICB9KVxuICAgIC5wb3N0KCcvYXBpL3YxL2NoYW5uZWxzJywgKHJlcSwgcmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IHsgZGF0YTogeyBhdHRyaWJ1dGVzOiB7IG5hbWUgfSB9IH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIHJlbW92YWJsZTogdHJ1ZSxcbiAgICAgICAgaWQ6IGdldE5leHRJZCgpLFxuICAgICAgfTtcbiAgICAgIHN0YXRlLmNoYW5uZWxzLnB1c2goY2hhbm5lbCk7XG4gICAgICByZXBseS5jb2RlKDIwMSk7XG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ2NoYW5uZWxzJyxcbiAgICAgICAgICBpZDogY2hhbm5lbC5pZCxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiBjaGFubmVsLFxuICAgICAgICB9LFxuICAgICAgfTtcblxuICAgICAgcmVwbHkuc2VuZChkYXRhKTtcbiAgICAgIGlvLmVtaXQoJ25ld0NoYW5uZWwnLCBkYXRhKTtcbiAgICB9KVxuICAgIC5kZWxldGUoJy9hcGkvdjEvY2hhbm5lbHMvOmlkJywgKHJlcSwgcmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5uZWxJZCA9IE51bWJlcihyZXEucGFyYW1zLmlkKTtcbiAgICAgIHN0YXRlLmNoYW5uZWxzID0gc3RhdGUuY2hhbm5lbHMuZmlsdGVyKChjKSA9PiBjLmlkICE9PSBjaGFubmVsSWQpO1xuICAgICAgc3RhdGUubWVzc2FnZXMgPSBzdGF0ZS5tZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0uY2hhbm5lbElkICE9PSBjaGFubmVsSWQpO1xuICAgICAgcmVwbHkuY29kZSgyMDQpO1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHR5cGU6ICdjaGFubmVscycsXG4gICAgICAgICAgaWQ6IGNoYW5uZWxJZCxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHJlcGx5LnNlbmQoZGF0YSk7XG4gICAgICBpby5lbWl0KCdyZW1vdmVDaGFubmVsJywgZGF0YSk7XG4gICAgfSlcbiAgICAucGF0Y2goJy9hcGkvdjEvY2hhbm5lbHMvOmlkJywgKHJlcSwgcmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5uZWxJZCA9IE51bWJlcihyZXEucGFyYW1zLmlkKTtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBzdGF0ZS5jaGFubmVscy5maW5kKChjKSA9PiBjLmlkID09PSBjaGFubmVsSWQpO1xuXG4gICAgICBjb25zdCB7IGRhdGE6IHsgYXR0cmlidXRlcyB9IH0gPSByZXEuYm9keTtcbiAgICAgIGNoYW5uZWwubmFtZSA9IGF0dHJpYnV0ZXMubmFtZTtcblxuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHR5cGU6ICdjaGFubmVscycsXG4gICAgICAgICAgaWQ6IGNoYW5uZWxJZCxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiBjaGFubmVsLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHJlcGx5LnNlbmQoZGF0YSk7XG4gICAgICBpby5lbWl0KCdyZW5hbWVDaGFubmVsJywgZGF0YSk7XG4gICAgfSlcbiAgICAuZ2V0KCcvYXBpL3YxL2NoYW5uZWxzLzpjaGFubmVsSWQvbWVzc2FnZXMnLCAocmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZXMgPSBzdGF0ZS5tZXNzYWdlcy5maWx0ZXIoKG0pID0+IG0uY2hhbm5lbElkID09PSBOdW1iZXIocmVxLnBhcmFtcy5jaGFubmVsSWQpKTtcbiAgICAgIGNvbnN0IHJlc291cmNlcyA9IG1lc3NhZ2VzLm1hcCgobSkgPT4gKHtcbiAgICAgICAgdHlwZTogJ21lc3NhZ2VzJyxcbiAgICAgICAgaWQ6IG0uaWQsXG4gICAgICAgIGF0dHJpYnV0ZXM6IG0sXG4gICAgICB9KSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzb3VyY2VzLFxuICAgICAgfTtcbiAgICAgIHJlcGx5LnNlbmQocmVzcG9uc2UpO1xuICAgIH0pXG4gICAgLnBvc3QoJy9hcGkvdjEvY2hhbm5lbHMvOmNoYW5uZWxJZC9tZXNzYWdlcycsIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCB7IGRhdGE6IHsgYXR0cmlidXRlcyB9IH0gPSByZXEuYm9keTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICAgIC4uLmF0dHJpYnV0ZXMsXG4gICAgICAgIGNoYW5uZWxJZDogTnVtYmVyKHJlcS5wYXJhbXMuY2hhbm5lbElkKSxcbiAgICAgICAgaWQ6IGdldE5leHRJZCgpLFxuICAgICAgfTtcbiAgICAgIHN0YXRlLm1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICByZXBseS5jb2RlKDIwMSk7XG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdHlwZTogJ21lc3NhZ2VzJyxcbiAgICAgICAgICBpZDogbWVzc2FnZS5pZCxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiBtZXNzYWdlLFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIHJlcGx5LnNlbmQoZGF0YSk7XG4gICAgICBpby5lbWl0KCduZXdNZXNzYWdlJywgZGF0YSk7XG4gICAgfSk7XG59O1xuIl19