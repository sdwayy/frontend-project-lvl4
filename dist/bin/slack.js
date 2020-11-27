#! /usr/bin/env node
"use strict";

var _ = _interopRequireDefault(require(".."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || 5000;
var app = (0, _.default)({
  port: port
});
app.listen(port, '0.0.0.0', function () {
  console.log("Server has been started on ".concat(port));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NlcnZlci9iaW4vc2xhY2suanMiXSwibmFtZXMiOlsicG9ydCIsInByb2Nlc3MiLCJlbnYiLCJQT1JUIiwiYXBwIiwibGlzdGVuIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7O0FBRUEsSUFBTUEsSUFBSSxHQUFHQyxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsSUFBWixJQUFvQixJQUFqQztBQUNBLElBQU1DLEdBQUcsR0FBRyxlQUFPO0FBQUVKLEVBQUFBLElBQUksRUFBSkE7QUFBRixDQUFQLENBQVo7QUFDQUksR0FBRyxDQUFDQyxNQUFKLENBQVdMLElBQVgsRUFBaUIsU0FBakIsRUFBNEIsWUFBTTtBQUNoQ00sRUFBQUEsT0FBTyxDQUFDQyxHQUFSLHNDQUEwQ1AsSUFBMUM7QUFDRCxDQUZEIiwic291cmNlc0NvbnRlbnQiOlsiIyEgL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IGdldEFwcCBmcm9tICcuLic7XG5cbmNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDUwMDA7XG5jb25zdCBhcHAgPSBnZXRBcHAoeyBwb3J0IH0pO1xuYXBwLmxpc3Rlbihwb3J0LCAnMC4wLjAuMCcsICgpID0+IHtcbiAgY29uc29sZS5sb2coYFNlcnZlciBoYXMgYmVlbiBzdGFydGVkIG9uICR7cG9ydH1gKTtcbn0pO1xuIl19